#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { config } from '../config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = config.dataDir
const targetUser = config.targetUser

// Enhanced pun detection patterns (same as analyze-puns.js)
const punConfig = {
  directMentions: ['pun', 'puns', 'punny', 'wordplay', 'dad joke', 'dad-joke'],
  wordplayPatterns: [
    /\b(yantastic|yanth)\b/i,             // Yantastic (Yanth + fantastic) - Clear pun
    /\b(wingin|winging)\b/i,              // Winging it (wings + winging) - Clear pun
    /\b(praise hammer|hammer praise)\b/i, // Dark Souls reference - Clear pun
    /\b(titan memes|memes titan)\b/i,     // Titan memes - Clear pun
    /\b(slog|slogging)\b/i,               // SLOG (slow + log) - Clear pun
    /\b(that's my line|my line)\b/i,      // Reference/quote pun - Clear pun
    /\b(teemo|teemoing)\b/i,              // Teemo (League reference) - Clear pun
    /\b(misteak|mistake)\b/i,             // Mistake/misteak homophone - Clear pun
    /\b(whale|whaling)\b.*\b(pun|made)\b/i, // Whale/whaling pun - Requires context
    /\b(punt|punting)\b.*\b(position|good)\b/i, // Punt/punting pun - Requires context
    /\b(chest|chesty)\b.*\b(off|get)\b/i, // Chest pun - Requires context
    /\b(ice hurts?|hurts? ice)\b/i,      // Ice hurts pun - Clear pun
    /\b(fall hurts?|hurts? fall)\b/i,    // Fall hurts pun - Clear pun
    /\b(blu|blue)\b.*\b(feeling|gonna|group)\b/i, // BLU/blue pun - Requires context
    /\b(frog-et|forget)\b/i,              // frog-et/forget homophone - Clear pun
    /\b(snake.*petrif|petrif.*snake)\b/i, // Snake petrifies (stone pun) - Clear pun
    /\b(grave.*issue|issue.*grave)\b/i,  // Grave issue (death/serious pun) - Clear pun
    /\b(grave|graves)\b.*\b(dig|digging)\b/i, // Grave digging context - Clear pun
    /\b(phase.*petrif|petrif.*phase)\b/i, // Phase petrifies - Clear pun
    /\b(frog|frogs)\b.*\b(get|getting|got)\b.*\b(et|forget)\b/i, // Frog-et/get context - Clear pun
  ],
  contextPatterns: [
    /\b(like|i mean|but|so|well|yeah|anyway)\b.*\b(pun|puns|joke)\b/i,
    /\b(get it|you know|right|eh|aye)\b.*\?*$/i,
  ],
  humorEmojis: ['😂', '🤣', '😆', '😅', '🙃', '😏', '🤪', '🤡', '🎪', '🎭', '🎨'],
  reactionThreshold: 1,
  highReactionThreshold: 3,
  shortMessageThreshold: 120,
  oneLinerThreshold: 50,
}

function analyzeMessageForPuns(message) {
  const content = message.content || ''

  // Skip quotes (messages in quotation marks are usually not original puns)
  if (content.startsWith('"') && content.endsWith('"') ||
      content.startsWith('"') && content.includes('" - ') ||
      /^\s*".*"\s*-\s*/.test(content)) {
    return {
      isPun: false,
      score: 0,
      indicators: [],
      content: content,
      reactions: message.reactions?.reduce((sum, r) => sum + (r.count || 0), 0) || 0,
      timestamp: message.timestamp,
      channel: '',
      id: message.id
    }
  }

  let punScore = 0
  let punIndicators = []

  // 1. Wordplay patterns (PRIMARY indicator - linguistic analysis)
  let wordplayFound = false
  punConfig.wordplayPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      punScore += 5 // Much higher weight for actual wordplay
      punIndicators.push(`Wordplay detected: ${pattern.source.replace(/\\/g, '').replace(/\([^)]*\)/g, '').slice(0, 20)}`)
      wordplayFound = true
    }
  })

  // 2. Direct pun references (only if they show actual pun intent)
  punConfig.directMentions.forEach(word => {
    if (content.toLowerCase().includes(word)) {
      // Only count if there's actual wordplay or it's a short, punchy statement
      const hasWordplay = punConfig.wordplayPatterns.some(p => p.test(content))
      const isPunchy = content.length <= punConfig.oneLinerThreshold

      if (hasWordplay || isPunchy) {
        punScore += 3
        punIndicators.push(`Direct pun reference: "${word}"`)
      } else {
        // Just mentioning "pun" without actual pun = low score
        punScore += 0.5
        punIndicators.push(`Mentions "${word}" (context needed)`)
      }
    }
  })

  // 3. Contextual humor indicators (setup/punchline patterns)
  punConfig.contextPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      punScore += 2
      punIndicators.push(`Contextual humor setup`)
    }
  })

  // 4. Humor emoji indicators (supports but doesn't define pun)
  const hasHumorEmoji = punConfig.humorEmojis.some(emoji => content.includes(emoji))
  if (hasHumorEmoji && wordplayFound) {
    punScore += 1
    punIndicators.push(`Humor emoji + wordplay`)
  }

  // 5. Social validation (secondary - only boosts confirmed puns)
  const reactionCount = message.reactions?.reduce((sum, r) => sum + (r.count || 0), 0) || 0
  if (wordplayFound && reactionCount >= punConfig.highReactionThreshold) {
    punScore += 2
    punIndicators.push(`${reactionCount} reactions (social validation)`)
  } else if (wordplayFound && reactionCount >= punConfig.reactionThreshold) {
    punScore += 1
    punIndicators.push(`${reactionCount} reactions`)
  }

  // 6. Linguistic characteristics (only for messages with wordplay)
  if (content.length > 0 && wordplayFound) {
    if (content.length <= punConfig.oneLinerThreshold) {
      punScore += 1.5
      punIndicators.push(`Concise delivery (${content.length} chars)`)
    } else if (content.length <= punConfig.shortMessageThreshold) {
      punScore += 1
      punIndicators.push(`Punchy message (${content.length} chars)`)
    }
  }

  // 7. Question marks (can indicate punchlines)
  const questionCount = (content.match(/\?/g) || []).length
  if (questionCount > 0 && wordplayFound && content.length <= punConfig.shortMessageThreshold) {
    punScore += 0.5
    punIndicators.push(`Rhetorical question format`)
  }

  // REQUIRE wordplay for a pun - otherwise it's just humor or engagement
  const hasLinguisticBasis = wordplayFound ||
    (punIndicators.some(ind => ind.includes('Direct pun reference:')) &&
     content.length <= punConfig.oneLinerThreshold)

  return {
    isPun: hasLinguisticBasis && punScore >= 2.5, // Slightly more lenient for subtle puns
    score: punScore,
    indicators: punIndicators,
    content: content,
    reactions: reactionCount,
    timestamp: message.timestamp,
    channel: '',
    id: message.id
  }
}

function processFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)

    if (!data.messages || !Array.isArray(data.messages)) {
      return []
    }

    const userMessages = data.messages.filter(msg =>
      msg.author?.name === targetUser ||
      msg.author?.id === targetUser ||
      msg.author?.nickname === targetUser ||
      (msg.author?.nickname && msg.author.nickname.toLowerCase().includes(targetUser.toLowerCase()))
    )

    return userMessages.map(msg => {
      const analysis = analyzeMessageForPuns(msg)
      return {
        ...analysis,
        channel: data.channel?.name || 'unknown',
      }
    })
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return []
  }
}

function exportAllPuns() {
  console.log(`🔍 Exporting all puns by user: ${targetUser}`)
  console.log('=' .repeat(50))

  if (!fs.existsSync(dataDir)) {
    console.error(`Data directory not found: ${dataDir}`)
    process.exit(1)
  }

  const files = fs.readdirSync(dataDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))

  console.log(`Processing ${jsonFiles.length} JSON files...\n`)

  let totalMessages = 0
  let punMessages = []

  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file)
    const messages = processFile(filePath)

    totalMessages += messages.length

    messages.forEach(msg => {
      const timestamp = new Date(msg.timestamp)
      if (timestamp.getFullYear() !== config.year) return

      if (msg.isPun) {
        punMessages.push(msg)
      }
    })
  }

  // Deduplicate by content (keep the one with highest score)
  const seenContent = new Map()
  punMessages.forEach(msg => {
    const content = msg.content
    const existing = seenContent.get(content)
    if (!existing || (msg.score + (msg.reactions * 0.5)) > (existing.score + (existing.reactions * 0.5))) {
      seenContent.set(content, msg)
    }
  })
  punMessages = Array.from(seenContent.values())

  // Sort by score and reactions
  punMessages.sort((a, b) => {
    const scoreA = a.score + (a.reactions * 0.5)
    const scoreB = b.score + (b.reactions * 0.5)
    return scoreB - scoreA
  })

  console.log(`📊 EXPORT RESULTS`)
  console.log(`Total messages from ${targetUser}: ${totalMessages}`)
  console.log(`Total unique puns/bad jokes: ${punMessages.length}`)
  console.log(`Pun percentage: ${totalMessages > 0 ? ((punMessages.length / totalMessages) * 100).toFixed(1) : 0}%`)
  console.log()

  // Export to JSON file
  const exportData = {
    summary: {
      user: targetUser,
      totalMessages,
      totalPuns: punMessages.length,
      punPercentage: totalMessages > 0 ? ((punMessages.length / totalMessages) * 100).toFixed(1) : 0,
      generatedAt: new Date().toISOString()
    },
    puns: punMessages.map((msg, index) => ({
      rank: index + 1,
      date: new Date(msg.timestamp).toLocaleDateString(),
      channel: msg.channel,
      content: msg.content,
      score: msg.score,
      reactions: msg.reactions,
      indicators: msg.indicators
    }))
  }

  const outputPath = path.join(__dirname, '..', 'altani-puns-2025.json')
  fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2))

  // Also copy to public directory for web app
  const publicPath = path.join(__dirname, '..', 'public', 'altani-puns-2025.json')
  fs.writeFileSync(publicPath, JSON.stringify(exportData, null, 2))

  console.log(`✅ Exported all ${punMessages.length} puns to: ${outputPath}`)
  console.log('📁 Also copied to public directory for web app')
  console.log()
  console.log('🎯 TOP 5 PUNS PREVIEW:')
  console.log('-'.repeat(40))

  punMessages.slice(0, 5).forEach((msg, index) => {
    const date = new Date(msg.timestamp).toLocaleDateString()
    console.log(`${index + 1}. [${date}] #${msg.channel}`)
    console.log(`   "${msg.content}"`)
    console.log(`   Score: ${msg.score.toFixed(1)} | Reactions: ${msg.reactions}`)
    console.log()
  })
}

exportAllPuns()
