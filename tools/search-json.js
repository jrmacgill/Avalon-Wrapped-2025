#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Parse command line arguments
const args = process.argv.slice(2)
const dataDir = 'C:\\Users\\Evelyn\\Documents\\DED'

function parseArgs() {
  const config = {
    query: null,
    author: null,
    channel: null,
    minReactions: null,
    hasAttachments: false,
    hasMentions: false,
    dateFrom: null,
    dateTo: null,
    limit: 50,
    output: 'console', // 'console' or 'json'
  }

  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch (arg) {
      case '--query':
      case '-q':
        config.query = args[++i]
        break
      case '--author':
      case '-a':
        config.author = args[++i]
        break
      case '--channel':
      case '-c':
        config.channel = args[++i]
        break
      case '--min-reactions':
      case '-r':
        config.minReactions = parseInt(args[++i])
        break
      case '--has-attachments':
        config.hasAttachments = true
        break
      case '--has-mentions':
        config.hasMentions = true
        break
      case '--date-from':
        config.dateFrom = new Date(args[++i])
        break
      case '--date-to':
        config.dateTo = new Date(args[++i])
        break
      case '--limit':
      case '-l':
        config.limit = parseInt(args[++i])
        break
      case '--output':
      case '-o':
        config.output = args[++i]
        break
      case '--help':
      case '-h':
        printHelp()
        process.exit(0)
    }
  }

  return config
}

function printHelp() {
  console.log(`
Discord JSON Search Tool

Usage: node tools/search-json.js [options]

Options:
  --query, -q <text>           Search for text in message content
  --author, -a <name>          Filter by author name or nickname
  --channel, -c <name>         Filter by channel name
  --min-reactions, -r <num>    Minimum number of reactions
  --has-attachments            Only messages with attachments
  --has-mentions               Only messages with mentions
  --date-from <date>           Filter messages from date (ISO format)
  --date-to <date>             Filter messages to date (ISO format)
  --limit, -l <num>            Maximum results to return (default: 50)
  --output, -o <format>        Output format: 'console' or 'json' (default: console)
  --help, -h                   Show this help message

Examples:
  node tools/search-json.js --query "raid" --author "Kuma"
  node tools/search-json.js --min-reactions 5 --has-attachments
  node tools/search-json.js --query "FFXIV" --channel "general" --limit 10
  `)
}

function matchesQuery(message, config) {
  // Query text search
  if (config.query) {
    const content = message.content?.toLowerCase() || ''
    if (!content.includes(config.query.toLowerCase())) {
      return false
    }
  }

  // Author filter
  if (config.author) {
    const authorName = message.author?.name?.toLowerCase() || ''
    const authorNick = message.author?.nickname?.toLowerCase() || ''
    const searchTerm = config.author.toLowerCase()
    if (!authorName.includes(searchTerm) && !authorNick.includes(searchTerm)) {
      return false
    }
  }

  // Reactions filter
  if (config.minReactions !== null) {
    const reactionCount = message.reactions?.reduce((sum, r) => sum + (r.count || 0), 0) || 0
    if (reactionCount < config.minReactions) {
      return false
    }
  }

  // Attachments filter
  if (config.hasAttachments && (!message.attachments || message.attachments.length === 0)) {
    return false
  }

  // Mentions filter
  if (config.hasMentions && (!message.mentions || message.mentions.length === 0)) {
    return false
  }

  // Date filters
  if (config.dateFrom || config.dateTo) {
    const msgDate = new Date(message.timestamp)
    if (config.dateFrom && msgDate < config.dateFrom) {
      return false
    }
    if (config.dateTo && msgDate > config.dateTo) {
      return false
    }
  }

  return true
}

function searchInFile(filePath, config) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    const results = []

    if (!data.messages || !Array.isArray(data.messages)) {
      return results
    }

    const channelName = data.channel?.name || 'unknown'
    
    // Channel filter
    if (config.channel) {
      const searchChannel = config.channel.toLowerCase()
      if (!channelName.toLowerCase().includes(searchChannel)) {
        return results
      }
    }

    for (const message of data.messages) {
      if (matchesQuery(message, config)) {
        results.push({
          ...message,
          channelName: channelName,
          channelCategory: data.channel?.category || 'unknown',
        })
        if (results.length >= config.limit) {
          break
        }
      }
    }

    return results
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return []
  }
}

function formatMessage(message) {
  const date = new Date(message.timestamp).toLocaleString()
  const author = message.author?.nickname || message.author?.name || 'Unknown'
  const reactions = message.reactions?.reduce((sum, r) => sum + (r.count || 0), 0) || 0
  const attachments = message.attachments?.length || 0
  
  return {
    date,
    author,
    channel: message.channelName,
    content: message.content?.substring(0, 200) || '(no content)',
    reactions,
    attachments,
    url: `https://discord.com/channels/${message.channelId}/${message.id}`,
  }
}

async function main() {
  const config = parseArgs()

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    printHelp()
    return
  }

  if (!fs.existsSync(dataDir)) {
    console.error(`Data directory not found: ${dataDir}`)
    console.error('Please update the dataDir path in tools/search-json.js')
    process.exit(1)
  }

  console.log('Searching JSON files...\n')
  const allResults = []

  // Read all JSON files
  const files = fs.readdirSync(dataDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file)
    const results = searchInFile(filePath, config)
    allResults.push(...results)
    
    if (allResults.length >= config.limit) {
      break
    }
  }

  // Sort by timestamp (newest first)
  allResults.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  // Limit results
  const limitedResults = allResults.slice(0, config.limit)

  if (config.output === 'json') {
    console.log(JSON.stringify(limitedResults.map(formatMessage), null, 2))
  } else {
    console.log(`Found ${limitedResults.length} matching messages:\n`)
    limitedResults.forEach((msg, idx) => {
      const formatted = formatMessage(msg)
      console.log(`${idx + 1}. [${formatted.date}] ${formatted.author} in #${formatted.channel}`)
      console.log(`   ${formatted.content}`)
      if (formatted.reactions > 0) {
        console.log(`   ⭐ ${formatted.reactions} reactions`)
      }
      if (formatted.attachments > 0) {
        console.log(`   📎 ${formatted.attachments} attachments`)
      }
      console.log('')
    })
  }
}

main().catch(console.error)


