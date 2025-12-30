#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = 'C:\\Users\\Evelyn\\Documents\\DED'

// Pun/joke detection patterns
const punIndicators = {
  // Explicit mentions of puns/jokes
  explicit: /\b(pun|joke|punny|jokey|dad joke|wordplay|play on words)\b/i,

  // Laughter indicators
  laughter: /\b(lol|lolz|haha|hahaha|lmao|lmfao|rofl|kekw|omegalul)\b/i,

  // Question marks (often used in jokes)
  questions: /\?{2,}|\?!\?|\?!/,

  // Exclamation points (emphasis in jokes)
  emphasis: /!{2,}/,

  // Short punchy messages (under 10 words, likely jokes)
  short: (text) => {
    const words = text.split(/\s+/).length
    return words <= 8 && words > 2
  },

  // Wordplay patterns
  wordplay: [
    /\b(figment\w*)/i,  // figmental, figmenting, etc.
    /\b(yant\w*)/i,     // yantastic, etc.
    /\b(wing\w*)/i,     // wingin' it, etc.
    /\b(snow\w*)/i,     // snow-related puns
    /\b(alt\w*)/i,      // altani-related puns
    /\b(devious\w*)/i,  // devious-related puns
  ]
}

// Known pun messages (from manual review)
const knownPuns = [
  "I can make it painful through puns.",
  "I propose Maps Monday be renamed to Figmental Foraging Fridays.",
  "I'm sure it'll be a yantastic time for everyone.",
  "Wingin' it.",
  "You should be absolutely fine in Valley Girl. Worst that can happen is Arekin kills us all.",
  "That's my line.",
  "The ice isn't what hurts you.",
  "It's the emotional pain as you fall.",
  "|| Incoming Titan memes ||",
  "Kill them. Then kill me.",
  "*Praise hammer*",
  "You started it with Ex1. I'm just returning the favor.",
  "And now you never have to do it again.",
  "You'll spend nine minutes in act 2 and make one mistake and die.",
  "It is a SLOG to do that achievement, let me tell you.",
  "But nothing will be the same feel as dying on 197 during my solo POTD run.",
  "Solo some deep dungeons.",
  "I'm too scared to do ultimates.",
  "Bosses should go untargetable before every burst window.",
  "When it comes to figmentals, it's a free for all bloodbath.",
  "Nothing like doing maps while watching a movie.",
  "I find them pretty fire, tbh.",
  "I believe in you Esme, make us sages proud.",
  "Funky Floor 1 and Arcady 1 are big hurdles for fresh.",
  "GOLD GRINDING I HEAR?"
]

function analyzeMessage(content) {
  if (!content || content.trim() === '') return { isPun: false, reasons: [] }

  const reasons = []
  let isPun = false

  // Check explicit pun mentions
  if (punIndicators.explicit.test(content)) {
    reasons.push('explicit pun mention')
    isPun = true
  }

  // Check laughter indicators
  if (punIndicators.laughter.test(content)) {
    reasons.push('laughter indicator')
    isPun = true
  }

  // Check multiple punctuation
  if (punIndicators.questions.test(content)) {
    reasons.push('multiple questions')
    isPun = true
  }

  if (punIndicators.emphasis.test(content)) {
    reasons.push('heavy emphasis')
    isPun = true
  }

  // Check short punchy messages
  if (punIndicators.short(content)) {
    reasons.push('short punchy message')
    isPun = true
  }

  // Check wordplay patterns
  for (const pattern of punIndicators.wordplay) {
    if (pattern.test(content)) {
      reasons.push(`wordplay: ${pattern.source}`)
      isPun = true
      break
    }
  }

  // Check against known puns
  if (knownPuns.some(pun => content.toLowerCase().includes(pun.toLowerCase()))) {
    reasons.push('matches known pun')
    isPun = true
  }

  return { isPun, reasons }
}

function processFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    if (!data.messages || !Array.isArray(data.messages)) {
      return []
    }

    const altaniMessages = []

    for (const message of data.messages) {
      const authorName = message.author?.name?.toLowerCase() || ''
      const authorNickname = message.author?.nickname?.toLowerCase() || ''

      // Check if this is Altani (snowy0814 or Devious Altani)
      if (authorName.includes('snowy0814') ||
          authorNickname.includes('altani') ||
          authorName.includes('altani')) {

        const content = message.content || ''
        const analysis = analyzeMessage(content)

        altaniMessages.push({
          id: message.id,
          timestamp: message.timestamp,
          content: content,
          channel: data.channel?.name || 'unknown',
          reactions: message.reactions?.reduce((sum, r) => sum + (r.count || 0), 0) || 0,
          analysis: analysis
        })
      }
    }

    return altaniMessages
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return []
  }
}

function main() {
  console.log('🔍 Analyzing Altani\'s (snowy0814) messages for puns in 2025...\n')

  if (!fs.existsSync(dataDir)) {
    console.error(`Data directory not found: ${dataDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(dataDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  console.log(`Found ${jsonFiles.length} JSON files to analyze\n`)

  const allMessages = []
  let processedFiles = 0

  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file)
    console.log(`Analyzing: ${file}...`)

    const messages = processFile(filePath)
    allMessages.push(...messages)

    processedFiles++
    if (processedFiles % 5 === 0) {
      console.log(`  Processed ${processedFiles}/${jsonFiles.length} files...`)
    }
  }

  // Sort by timestamp
  allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))

  // Separate puns from non-puns
  const punMessages = allMessages.filter(msg => msg.analysis.isPun)
  const nonPunMessages = allMessages.filter(msg => !msg.analysis.isPun)

  console.log(`\n📊 ANALYSIS RESULTS:`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Total messages from Altani: ${allMessages.length}`)
  console.log(`Detected puns/jokes: ${punMessages.length}`)
  console.log(`Regular messages: ${nonPunMessages.length}`)
  console.log(`Pun percentage: ${((punMessages.length / allMessages.length) * 100).toFixed(1)}%`)

  if (punMessages.length > 0) {
    console.log(`\n🎭 DETECTED PUNS/JOKES:`)
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

    punMessages.forEach((msg, index) => {
      const date = new Date(msg.timestamp).toLocaleDateString()
      const reasons = msg.analysis.reasons.join(', ')

      console.log(`${index + 1}. [${date}] #${msg.channel}`)
      console.log(`   "${msg.content}"`)
      console.log(`   Reasons: ${reasons}`)
      if (msg.reactions > 0) {
        console.log(`   ⭐ ${msg.reactions} reactions`)
      }
      console.log('')
    })
  }

  console.log(`\n💡 ANALYSIS METHODOLOGY:`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`Detection criteria:`)
  console.log(`• Explicit mentions of puns/jokes`)
  console.log(`• Laughter indicators (lol, haha, etc.)`)
  console.log(`• Multiple punctuation (!?, ??)`)
  console.log(`• Short punchy messages (2-8 words)`)
  console.log(`• Wordplay patterns (figmental, yantastic, etc.)`)
  console.log(`• Known pun messages from manual review`)

  console.log(`\n⚠️  Note: This is an automated analysis. Some messages may be false positives or missed puns.`)
  console.log(`   For best accuracy, manual review of the flagged messages is recommended.`)
}

try {
  await main()
} catch (error) {
  console.error('Error:', error)
}

