#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Import Chat Analytics tokenization and text processing
import { tokenize } from 'chat-analytics/dist/pipeline/process/nlp/Tokenizer.js'
import { normalizeText, matchFormat } from 'chat-analytics/dist/pipeline/process/nlp/Text.js'

import { config } from '../config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dataDir = config.dataDir
const outputPath = path.join(__dirname, '..', 'public', 'data', 'stats.json')

// Users to exclude from all statistics (e.g., kicked users)
const BLACKLISTED_USERS = [
'352602166780755969',
'59319392646729728',
'408435025206312961',
'1375840910515900448',
'707673326473970305',
'131194008696389632'
  // Add user IDs here, e.g.:
  // '123456789012345678',
  // '987654321098765432'
]

// LARP-related keywords for custom stats
// Structure: { 'Display Name': ['search term 1', 'search term 2'] }
const LARP_KEYWORDS = {
    "roles": {
        "Warrior": [
            "warrior",
            "fighter",
            "mercenary",
            "soldier",
            "man-at-arms",
            "adventurer",
            "bodyguard",
            "thug"
        ],
        "Mage": [
            "mage",
            "wizard",
            "spellcaster",
            "hedge wizard",
            "combat mage",
            "student of magic"
        ],
        "Rogue": [
            "rogue",
            "thief",
            "scout",
            "burglar",
            "cutpurse",
            "footpad",
            "highwayman",
            "spy",
            "sneak",
            "lookout",
            "treasure hunter"
        ],
        "Cleric": [
            "cleric",
            "priest",
            "healer",
            "follower of the light",
            "blessed follower"
        ],
        "Paladin": [
            "paladin",
            "holy warrior",
            "champion of light",
            "blessed follower",
            "conall cearnarch"
        ],
        "White Sorcerer": [
            "white sorcerer",
            "blessed follower"
        ],
        "Druid": [
            "druid",
            "initiate of the mother",
            "high druid",
            "druid protector"
        ],
        "Dark Cleric": [
            "dark cleric",
            "servant of darkness"
        ],
        "Dark Paladin": [
            "dark paladin",
            "servant of darkness",
            "champion of evil",
            "sluagh"
        ],
        "Dark Sorcerer": [
            "dark sorcerer",
            "servant of darkness"
        ],
        "Warlock": [
            "warlock",
            "battle mage"
        ],
        "Sorcerer": [
            "sorcerer",
            "ritualist",
            "high mage",
            "gray sorcerer"
        ],
        "Alchemist": [
            "alchemist",
            "potion maker"
        ],
        "Spell Singer": [
            "spell singer",
            "spellsinger",
            "bard",
            "shanahee",
            "skald"
        ],
        "Ranger": [
            "ranger",
            "woodsman",
            "darkwood ranger"
        ],
        "Assassin": [
            "assassin",
            "killer for hire"
        ],
        "Master Thief": [
            "master thief"
        ],
        "Master Warrior": [
            "master warrior"
        ],
        "Mystic Warrior": [
            "mystic warrior",
            "spellsword"
        ],
        "Warrior Monk": [
            "warrior monk",
            "monk",
            "martial artist"
        ],
        "Arcane Grifter": [
            "arcane grifter",
            "magical rogue"
        ],
        "Demon Hunter": [
            "demon hunter"
        ],
        "Necromancer": [
            "necromancer",
            "death mage",
            "animator"
        ],
        "Demonologist": [
            "demonologist",
            "summoner"
        ],
        "Acolyte": [
            "acolyte",
            "accolyte"
        ],
        "Diviner": [
            "diviner",
            "seer",
            "fortune teller",
            "medium"
        ],
        "Prince": [
            "prince",
            "princess",
            "royal highness"
        ],
        "Duke": [
            "duke",
            "duchess",
            "your grace"
        ],
        "Count": [
            "count",
            "countess",
            "earl"
        ],
        "Baron": [
            "baron",
            "baroness"
        ],
        "Viceroy": [
            "viceroy"
        ],
        "Marquis": [
            "marquis",
            "marquee"
        ],
        "Lord": [
            "lord",
            "lady"
        ],
        "Knight": [
            "knight",
            "sir",
            "dame"
        ],
        "Squire": [
            "squire"
        ],
        "Seneschal": [
            "seneschal"
        ],
        "Chancellor": [
            "lord chancellor",
            "lady chancellor"
        ],
        "Warlord": [
            "warlord"
        ],
        "High Inquisitor": [
            "high inquisitor",
            "lord inquisitor"
        ],
        "Sheriff": [
            "sheriff",
            "high sheriff"
        ],
        "Magistrate": [
            "magistrate"
        ],
        "Constable": [
            "constable"
        ],
        "Mayor": [
            "mayor"
        ],
        "Warden of the Land": [
            "warden of the land",
            "warden"
        ],
        "Ambassador": [
            "ambassador",
            "consul",
            "leno"
        ],
        "Guild Master": [
            "guild master",
            "guildmistress",
            "guildmaster"
        ],
        "Master": [
            "master",
            "mistress"
        ],
        "Journeyman": [
            "journeyman"
        ],
        "Apprentice": [
            "apprentice"
        ],
        "Smith": [
            "weapon smith",
            "armor smith",
            "blacksmith",
            "smith"
        ],
        "Healer": [
            "healer"
        ],
        "Merchant": [
            "merchant",
            "trader",
            "shop keep"
        ],
        "Scribe": [
            "scribe",
            "recordkeeper"
        ],
        "Teacher": [
            "instructor",
            "tutor",
            "mentor"
        ],
        "Researcher": [
            "researcher",
            "scholar"
        ],
        "Artisan/Crafter": [
            "artist",
            "candle maker",
            "carpenter",
            "carpet maker",
            "cobbler",
            "cooper",
            "gem cutter",
            "glass blower",
            "mason",
            "potter",
            "tailor",
            "clothier",
            "thatcher",
            "tinker",
            "parchmenter"
        ],
        "Laborer": [
            "laborer",
            "lumberjack",
            "miner",
            "teamster",
            "servant"
        ],
        "Bartender": [
            "baker",
            "bartender",
            "brewer",
            "cook",
            "distiller",
            "innkeep",
            "miller",
            "vintner"
        ],
        "Agriculture": [
            "crop farmer",
            "dairy farmer",
            "pig farmer",
            "farmer",
            "herder",
            "rancher",
            "gardener"
        ],
        "Maritime": [
            "sailor",
            "shipwright",
            "fisherman",
            "captain",
            "commodore",
            "admiral"
        ],
        "Performer": [
            "town crier",
            "minstrel"
        ],
        "Dragon Knight": [
            "dragon knight",
            "dragon's champion"
        ],
        "Demon Knight": [
            "demon knight",
            "hierarch's champion"
        ],
        "Forestal": [
            "forestal"
        ],
        "Guardian": [
            "guardsman",
            "guard",
            "protectorate"
        ],
        "Animal Handler": [
            "animal trainer",
            "hunter",
            "trapper",
            "furrier"
        ]
    },
    "factions": {
        "The High Lord": [
            "highlord",
            "high lord",
            "the light",
            "followers of light",
            "house of the sun"
        ],
        "The Dark Lord": [
            "darklord",
            "dark lord",
            "the darkness",
            "servants of darkness"
        ],
        "The Mother": [
            "the mother",
            "followers of the mother",
            "druids",
            "druids circle",
            "warden of the land"
        ],
        "Avalon": [
            "duchy of avalon",
            "avalonian",
            "the duchy",
            "the host",
            "avalonian host"
        ],
        "Nymidia": [
            "nymidian empire",
            "the empire",
            "old nymidia"
        ],
        "Terris Republic": [
            "terris",
            "the republic",
            "ix legion",
            "9th legion"
        ],
        "Mistwood": [
            "kingdom of the elves",
            "the wood",
            "mistwood elves",
            "quentis"
        ],
        "Dark Elves": [
            "drow",
            "deepening realm",
            "underdark",
            "house szolarleth",
            "house il durthar"
        ],
        "Council of Dragons": [
            "the dragons",
            "dragon council",
            "seats of the dragons"
        ],
        "Council of Hierarchs": [
            "the hierarchs",
            "hierarch council",
            "lords of hell",
            "the nine"
        ],
        "Malificari": [
            "maleficari",
            "cult of the python",
            "red daggers"
        ],
        "The Void": [
            "lord of the deep",
            "void creatures",
            "hunters",
            "interregnum ex mortalis"
        ],
        "Coventry": [
            "free lands of coventry",
            "the syndicate",
            "coventry defense force",
            "cdf",
            "bag of rats"
        ],
        "The Fae": [
            "fae courts",
            "seelie",
            "unselee",
            "seasonal courts",
            "court of winter",
            "court of summer"
        ],
        "New Tiraine": [
            "tiraine",
            "new tiraine empire"
        ],
        "Saurians": [
            "sunscale empire",
            "commonwealth of nomana",
            "white city",
            "magada"
        ],
        "Halflings": [
            "new gleneden",
            "glenraven",
            "gleneden"
        ],
        "Midlantian Guard": [
            "midguard",
            "winter guard"
        ],
        "Guild of Arcane Lore": [
            "goal",
            "mages guild",
            "alchemist college"
        ],
        "Avalon Press": [
            "the press",
            "avalon press archives"
        ],
        "Coventry": [
            "Coventry",
            "The Word",
            "coventry collective",
            "the knowledge report"
        ],
        "Order of the Pyramid": [
            "Pyramid",
            "The Order"
        ],
        "Nine Hearts": [
            "nine hearts confederation",
            "nine hearts"
        ],
        "Knights of the Accuser": [
            "accusers",
            "d'amurgos knights"
        ],
        "Cult of the Cryptic Shade": [
            "cryptic shade",
            "azeroth's cult"
        ],
        "Almeida": [
            "kingdom of almeida",
            "the risen isle"
        ],
        "Barconia": [
            "barconian"
        ],
        "Highlanders": [
            "clans",
            "shanahee"
        ],
        "Firbolg": [
            "furbolg"
        ],
        "Vaerinfolk": [
            "vaerinfólk",
            "pale stalkers"
        ],
        "Kaletani": [
            "kaletani tribes"
        ],
        "Malleus": [
            "malleus",
            "the justicar"
        ],
        "Nivane": [
            "navaine",
            "nevayne",
            "the challenger"
        ],
        "Addic": [
            "the beast slayer"
        ],
        "Herpata": [
            "the provider",
            "great queen of the saurians"
        ],
        "Lunk": [
            "the seeker"
        ],
        "Zimiir": [
            "zamiir",
            "the new seeker"
        ],
        "Juliet": [
            "the healer"
        ],
        "Evander": [
            "the keeper of knowledge"
        ],
        "Drae": [
            "draegosian",
            "the defender"
        ],
        "Mardukes": [
            "mardux",
            "guardian of souls"
        ],
        "Zebulon": [
            "lord of the undead",
            "king of hell"
        ],
        "Pid": [
            "palimander"
        ],
        "Balphagor": [
            "lord of war"
        ],
        "Ophidia": [
            "lady of lies",
            "the python",
            "orpheus diaz"
        ],
        "Baine": [
            "hierarch of murder"
        ],
        "Bazmodeous": [
            "lord of chaos",
            "lord of fire"
        ],
        "Arachnia": [
            "spider queen"
        ],
        "Teera'al": [
            "tireall",
            "mistress of excess"
        ],
        "Margos": [
            "vampire hierarch",
            "lord of vampires"
        ],
        "Etrigant": [
            "the deceiver",
            "hierarch of secrets"
        ],
        "The Handmaiden": [
            "handmaiden",
            "fae title"
        ],
        "One Blood": [
            "one blood march",
            "half elves"
        ]
    },
  themes: {
    'Death': ['dying', 'death', 'dead', 'die', 'killed', 'kill', 'grave'],
    'Resurrection': ['resurrect', 'revive'],
    'Fighting': ['fight', 'fought', 'war', 'battle'],
    'Drinking': ['drunk', 'drink', 'hangover', 'pissed']
  }
}

// Enhanced word extraction using Chat Analytics tokenization
function extractWords(text) {
  if (!text) return []

  try {
    // Use Chat Analytics text processing pipeline: normalize -> tokenize
    const normalizedText = normalizeText(text)
    const tokens = tokenize(normalizedText)


    // Extract only word tokens (not URLs, emojis, mentions, etc.)
    const words = tokens
      .filter(token => token.tag === 'word')
      .map(token => token.text.toLowerCase())
      .filter(word => word.length > 0)

    return words
  } catch (error) {
    console.warn('Chat Analytics tokenization failed, falling back to basic extraction:', error.message)

    // Fallback to our original approach if Chat Analytics fails
    return text
      .toLowerCase()
      .replace(/https?:\/\/[^\s]+/g, '')
      .replace(/<@!?\d+>/g, '')
      .replace(/<#\d+>/g, '')
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2)
  }
}

function processFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(fileContent)
    
    if (!data.messages || !Array.isArray(data.messages)) {
      return null
    }

    return {
      channel: data.channel?.name || 'unknown',
      category: data.channel?.category || 'unknown',
      messages: data.messages,
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message)
    return null
  }
}

function aggregateStats() {
  console.log('Processing Discord JSON files...\n')
  
  const stats = {
    totalMessages: 0,
    uniqueUsers: new Set(),
    channels: {},
    users: {},
    activityByHour: new Array(24).fill(0),
    activityByDay: new Array(7).fill(0),
    activityByMonth: new Array(12).fill(0),
    reactions: [],
    words: {},
    attachments: {
      total: 0,
      images: 0,
      videos: 0,
      other: 0,
    },
    emojis: {
      messageEmojis: {}, // Emojis used in message text (Unicode)
      reactionEmojis: {}, // Emojis used in reactions (Unicode)
      messageCustomEmojis: {}, // Custom emojis in messages {emojiKey: {name, id, animated, count}}
      reactionCustomEmojis: {}, // Custom emojis in reactions {emojiKey: {name, id, animated, count}}
    },
    larp: {
      roleMentions: {},
      factionMentions: {},
      themeMentions: {},
    },
    topMessages: [],
  dateRange: {
    earliest: null,
    latest: null,
  },
  _dateRangeDates: {
    earliest: null,
    latest: null,
  },
  }

  if (!fs.existsSync(dataDir)) {
    console.error(`Data directory not found: ${dataDir}`)
    console.error('Please update the dataDir path in config.js')
    process.exit(1)
  }

  const files = fs.readdirSync(dataDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))
  
  console.log(`Found ${jsonFiles.length} JSON files to process\n`)

  let processedFiles = 0
  for (const file of jsonFiles) {
    const filePath = path.join(dataDir, file)
    console.log(`Processing: ${file}...`)
    
    const fileData = processFile(filePath)
    if (!fileData) continue

    const channelKey = `${fileData.category}/${fileData.channel}`
    
    if (!stats.channels[channelKey]) {
      stats.channels[channelKey] = {
        name: fileData.channel,
        category: fileData.category,
        messageCount: 0,
      }
    }

    for (const message of fileData.messages) {
      const timestamp = new Date(message.timestamp)
      // Filter for configured year
      if (timestamp.getFullYear() !== config.year) continue

      // Skip bot messages for some stats
      const isBot = message.author?.isBot || false
      
      stats.totalMessages++
      stats.channels[channelKey].messageCount++

      // User stats
      const userId = message.author?.id
      const userName = message.author?.nickname || message.author?.name || 'Unknown'

      // Skip blacklisted users (kicked users, etc.)
      const isBlacklisted = BLACKLISTED_USERS.includes(userId)
      if (isBlacklisted) {
        continue // Skip this message entirely
      }

      if (userId && !isBot) {
        stats.uniqueUsers.add(userId)
        
        if (!stats.users[userId]) {
          stats.users[userId] = {
            id: userId,
            name: userName,
            nickname: message.author?.nickname,
            avatarUrl: message.author?.avatarUrl,
            messageCount: 0,
            reactionCount: 0,
            attachmentCount: 0,
            // Time-based activity
            nightMessages: 0, // 11PM-5AM
            morningMessages: 0, // 5AM-11AM
            weekendMessages: 0,
            // Channel diversity
            channelsActive: new Set(),
            // Social interaction
            uniqueMentions: new Set(),
            uniqueEmojis: new Set(),
            replyCount: 0,
            // Content analysis
            questionCount: 0,
            larpContent: 0,
            memeChannelMessages: 0,
            // Message style
            totalMessageLength: 0,
            messageLengths: [],
          }
        }
        stats.users[userId].messageCount++
      }

      // Activity by hour/day
      if (stats._dateRangeDates.earliest === null || timestamp < stats._dateRangeDates.earliest) {
        stats._dateRangeDates.earliest = timestamp
        stats.dateRange.earliest = timestamp.toISOString()
      }
      if (stats._dateRangeDates.latest === null || timestamp > stats._dateRangeDates.latest) {
        stats._dateRangeDates.latest = timestamp
        stats.dateRange.latest = timestamp.toISOString()
      }

      const hour = timestamp.getHours()
      const day = timestamp.getDay()
      const month = timestamp.getMonth() // 0-11 for Jan-Dec
      const dayOfWeek = day // 0=Sunday, 6=Saturday
      stats.activityByHour[hour]++
      stats.activityByDay[day]++
      stats.activityByMonth[month]++

      // Track additional user metrics for achievements
      if (userId && !isBot) {
        const messageContent = message.content || ''
        const messageLength = messageContent.length

        // Time-based activity
        if (hour >= 23 || hour < 5) {
          stats.users[userId].nightMessages++
        } else if (hour >= 5 && hour < 11) {
          stats.users[userId].morningMessages++
        }

        if (dayOfWeek === 0 || dayOfWeek === 6) { // Weekend
          stats.users[userId].weekendMessages++
        }

        // Channel diversity
        stats.users[userId].channelsActive.add(fileData.channel)

        // Message style
        stats.users[userId].totalMessageLength += messageLength
        stats.users[userId].messageLengths.push(messageLength)

        // Content analysis
        if (messageContent.trim().endsWith('?')) {
          stats.users[userId].questionCount++
        }

        // LARP content detection
        const lowerContent = messageContent.toLowerCase()
        let hasLarpContent = false
        
        // Check all LARP categories
        const checkKeywords = (categoryObj) => {
           for (const synonyms of Object.values(categoryObj)) {
             if (synonyms.some(term => lowerContent.includes(term))) return true
           }
           return false
        }

        if (checkKeywords(LARP_KEYWORDS.roles) || 
            checkKeywords(LARP_KEYWORDS.factions) || 
            checkKeywords(LARP_KEYWORDS.themes)) {
          hasLarpContent = true
        }

        if (hasLarpContent) {
          stats.users[userId].larpContent++
        }

        // Meme channel detection
        if (fileData.channel.toLowerCase().includes('meme') ||
            fileData.channel.toLowerCase().includes('memes')) {
          stats.users[userId].memeChannelMessages++
        }

        // Social interaction - mentions (@username format)
        const mentionRegex = /@(\w+(?:\s+\w+)*)/g
        let match
        while ((match = mentionRegex.exec(messageContent)) !== null) {
          const mentionedUser = match[1].toLowerCase().trim()
          // Skip common false positives (emails, URLs, etc.)
          if (!mentionedUser.includes('@') &&
              !mentionedUser.includes('http') &&
              !mentionedUser.includes('.com') &&
              !mentionedUser.includes('.org') &&
              mentionedUser.length > 2 &&
              mentionedUser.length < 50) {
            stats.users[userId].uniqueMentions.add(mentionedUser)
          }
        }

        // Emoji detection - count unique emojis used
        const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
        const emojisInMessage = messageContent.match(emojiRegex)
        if (emojisInMessage) {
          emojisInMessage.forEach(emoji => {
            // Track per-user unique emojis
            stats.users[userId].uniqueEmojis.add(emoji)
            // Track global emoji usage in messages
            stats.emojis.messageEmojis[emoji] = (stats.emojis.messageEmojis[emoji] || 0) + 1
          })
        }

        // Custom emoji detection (Discord format: <:name:id>)
        const customEmojiRegex = /<(a?):(\w+):(\d+)>/g
        const customEmojisInMessage = [...messageContent.matchAll(customEmojiRegex)]
        if (customEmojisInMessage.length > 0) {
          customEmojisInMessage.forEach(match => {
            const [, animated, name, id] = match
            const emojiKey = `${name}:${id}`
            if (!stats.emojis.messageCustomEmojis[emojiKey]) {
              stats.emojis.messageCustomEmojis[emojiKey] = {
                name,
                id,
                animated: animated === 'a',
                count: 0
              }
            }
            stats.emojis.messageCustomEmojis[emojiKey].count++
          })
        }

        // Additional detection for :name: format (shorthand typing)
        // Cross-reference with known custom emojis from reactions
        const shorthandEmojiRegex = /:(\w+):/g
        const shorthandMatches = [...messageContent.matchAll(shorthandEmojiRegex)]
        if (shorthandMatches.length > 0) {
          shorthandMatches.forEach(match => {
            const name = match[1]
            // Skip if it's a known Unicode emoji name or too short
            if (name.length <= 1) return

            // Check if this name matches any known custom emoji from reactions
            const matchingReactionEmoji = Object.keys(stats.emojis.reactionCustomEmojis).find(key => {
              return stats.emojis.reactionCustomEmojis[key].name === name
            })

            if (matchingReactionEmoji) {
              const reactionEmojiData = stats.emojis.reactionCustomEmojis[matchingReactionEmoji]
              const emojiKey = `${name}:${reactionEmojiData.id}`

              if (!stats.emojis.messageCustomEmojis[emojiKey]) {
                stats.emojis.messageCustomEmojis[emojiKey] = {
                  name,
                  id: reactionEmojiData.id,
                  animated: reactionEmojiData.animated,
                  count: 0
                }
              }
              stats.emojis.messageCustomEmojis[emojiKey].count++
            }
          })
        }

        // Reply detection (simple heuristic: messages that start with @ or quote another user)
        if (messageContent.includes('<@') || messageContent.startsWith('>') ||
            messageContent.includes('said:') || /^\s*@/.test(messageContent)) {
          stats.users[userId].replyCount++
        }
      }

      // Reactions
      if (message.reactions && message.reactions.length > 0) {
        const reactionCount = message.reactions.reduce((sum, r) => sum + (r.count || 0), 0)
        if (userId && !isBot && !isBlacklisted) {
          stats.users[userId].reactionCount += reactionCount
        }

        // Track emoji usage in reactions
        message.reactions.forEach(reaction => {
          const emoji = reaction.emoji
          if (emoji) {
            // Check if it's a custom emoji (has an id)
            if (emoji.id) {
              // Custom emoji in reaction
              const emojiKey = `${emoji.name}:${emoji.id}`
              if (!stats.emojis.reactionCustomEmojis[emojiKey]) {
                stats.emojis.reactionCustomEmojis[emojiKey] = {
                  name: emoji.name,
                  id: emoji.id,
                  animated: emoji.animated || false,
                  count: 0
                }
              }
              stats.emojis.reactionCustomEmojis[emojiKey].count += (reaction.count || 0)
            } else if (emoji.name) {
              // Unicode emoji
              const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
              if (emojiRegex.test(emoji.name)) {
                stats.emojis.reactionEmojis[emoji.name] = (stats.emojis.reactionEmojis[emoji.name] || 0) + (reaction.count || 0)
              }
            }
          }
        })

        stats.reactions.push({
          messageId: message.id,
          content: message.content?.substring(0, 100) || '',
          author: userName,
          channel: fileData.channel,
          reactionCount,
          timestamp: message.timestamp,
        })
      }

      // Attachments
      if (message.attachments && message.attachments.length > 0) {
        stats.attachments.total += message.attachments.length
        if (userId && !isBot && !isBlacklisted) {
          stats.users[userId].attachmentCount += message.attachments.length
        }
        
        message.attachments.forEach(att => {
          const ext = path.extname(att.fileName || '').toLowerCase()
          if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
            stats.attachments.images++
          } else if (['.mp4', '.webm', '.mov'].includes(ext)) {
            stats.attachments.videos++
          } else {
            stats.attachments.other++
          }
        })
      }

      // Word frequency
      if (message.content && !isBot) {
        const words = extractWords(message.content)
        words.forEach(word => {
          stats.words[word] = (stats.words[word] || 0) + 1
        })
      }

      // LARP-specific stats
      if (message.content && !isBot) {
        const contentLower = message.content.toLowerCase()
        
        // Role mentions
        for (const [role, synonyms] of Object.entries(LARP_KEYWORDS.roles)) {
          if (synonyms.some(term => contentLower.includes(term))) {
            stats.larp.roleMentions[role] = (stats.larp.roleMentions[role] || 0) + 1
          }
        }
        
        // Faction mentions
        for (const [faction, synonyms] of Object.entries(LARP_KEYWORDS.factions)) {
          if (synonyms.some(term => contentLower.includes(term))) {
            stats.larp.factionMentions[faction] = (stats.larp.factionMentions[faction] || 0) + 1
          }
        }
        
        // Theme mentions
        for (const [theme, synonyms] of Object.entries(LARP_KEYWORDS.themes)) {
          if (synonyms.some(term => contentLower.includes(term))) {
            stats.larp.themeMentions[theme] = (stats.larp.themeMentions[theme] || 0) + 1
          }
        }
      }
    }

    processedFiles++
    if (processedFiles % 5 === 0) {
      console.log(`  Processed ${processedFiles}/${jsonFiles.length} files...`)
    }
  }

  // Process and sort results
  console.log('\nProcessing results...')

  // Top users by message count
  const topUsers = Object.values(stats.users)
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 20)

  // Top users by reaction count (for Most Popular)
  const topReactors = Object.values(stats.users)
    .sort((a, b) => b.reactionCount - a.reactionCount)
    .slice(0, 20)

  // Top users by attachment count (for Media Master)
  const topMediaUsers = Object.values(stats.users)
    .sort((a, b) => b.attachmentCount - a.attachmentCount)
    .slice(0, 20)

  // Top channels
  const topChannels = Object.values(stats.channels)
    .sort((a, b) => b.messageCount - a.messageCount)
    .slice(0, 20)

  // Top reactions
  const topReactions = stats.reactions
    .sort((a, b) => b.reactionCount - a.reactionCount)
    .slice(0, 20)

  // Top words (excluding common words)
  // Load Chat Analytics stopwords for English
  const stopwordsData = JSON.parse(fs.readFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'node_modules', 'chat-analytics', 'assets', 'data', 'text', 'stopwords-iso.json'), 'utf-8'))
  const englishStopwords = new Set(stopwordsData.en.map(word => matchFormat(word)))

  // Check if a word is a stopword
  const isStopword = (word) => englishStopwords.has(matchFormat(word))

  // Use Chat Analytics style word processing - filter out stopwords like Chat Analytics does
  const topWords = Object.entries(stats.words)
    .filter(([word]) => !isStopword(word)) // Filter out stopwords
    .sort((a, b) => b[1] - a[1])
    .slice(0, 50)
    .map(([word, count]) => ({ word, count }))

  // Format LARP stats
  const topRoles = Object.entries(stats.larp.roleMentions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([role, count]) => ({ role, count }))

  const topFactions = Object.entries(stats.larp.factionMentions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([faction, count]) => ({ faction, count }))

  const topThemes = Object.entries(stats.larp.themeMentions)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([theme, count]) => ({ theme, count }))

  // Convert Sets to arrays for JSON serialization
  Object.values(stats.users).forEach(user => {
    user.channelsActive = Array.from(user.channelsActive)
    user.uniqueMentions = Array.from(user.uniqueMentions)
  })

  // Calculate all achievements with top 5
  const achievements = {}

  // Helper function to get top 5 for any metric
  const getTop5 = (candidates, minMessages = 5, sortBy = null) => {
    return candidates
      .filter(user => user.messageCount >= minMessages)
      .sort((a, b) => {
        // If sortBy is specified, use that metric
        if (sortBy) {
          const aVal = a[sortBy] || 0
          const bVal = b[sortBy] || 0
          return bVal - aVal // Sort descending
        }

        // Fallback to old logic for backward compatibility
        if (a.reactionRatio !== undefined) return b.reactionRatio - a.reactionRatio
        if (a.channelCount !== undefined) return b.channelCount - a.channelCount
        if (a.uniqueMentionCount !== undefined) return b.uniqueMentionCount - a.uniqueMentionCount
        if (a.avgMessageLength !== undefined) return b.avgMessageLength - a.avgMessageLength
        // Default numeric sort for other metrics
        const metricKeys = ['nightMessages', 'morningMessages', 'weekendMessages', 'replyCount', 'questionCount', 'larpContent', 'memeChannelMessages']
        for (const key of metricKeys) {
          if (a[key] !== undefined) return b[key] - a[key]
        }
        return 0
      })
      .slice(0, 5)
  }

  // Lurker award: users who react more than they message (relative to activity)
  const lurkerCandidates = Object.values(stats.users)
    .filter(user => user.messageCount >= 5)
    .map(user => ({
      ...user,
      reactionRatio: user.reactionCount / Math.max(user.messageCount, 1),
      totalEngagement: user.messageCount + user.reactionCount
    }))
    .filter(user => user.reactionRatio > 1)

  achievements.lurker = {
    top5: getTop5(lurkerCandidates, 5, 'reactionRatio'),
    metric: 'reactionRatio'
  }

  // Night Owl: Most messages between 11PM-5AM
  achievements.nightOwl = {
    top5: getTop5(Object.values(stats.users), 10, 'nightMessages'),
    metric: 'nightMessages'
  }

  // Early Bird: Most messages between 5AM-11AM
  achievements.earlyBird = {
    top5: getTop5(Object.values(stats.users), 10, 'morningMessages'),
    metric: 'morningMessages'
  }

  // Weekend Warrior: Most messages on weekends
  achievements.weekendWarrior = {
    top5: getTop5(Object.values(stats.users), 10, 'weekendMessages'),
    metric: 'weekendMessages'
  }

  // Channel Surfer: Active in most different channels
  const channelSurferCandidates = Object.values(stats.users)
    .map(user => ({ ...user, channelCount: user.channelsActive.length }))

  achievements.channelSurfer = {
    top5: getTop5(channelSurferCandidates, 5, 'channelCount'),
    metric: 'channelCount'
  }

  // Social Butterfly: Mentions most unique users
  const socialButterflyCandidates = Object.values(stats.users)
    .map(user => ({ ...user, uniqueMentionCount: user.uniqueMentions.length }))

  achievements.socialButterfly = {
    top5: getTop5(socialButterflyCandidates, 5, 'uniqueMentionCount'),
    metric: 'uniqueMentionCount'
  }

  // Reply Master: Most replies to other messages
  achievements.replyMaster = {
    top5: getTop5(Object.values(stats.users), 10, 'replyCount'),
    metric: 'replyCount'
  }

  // Question Master: Most questions asked
  achievements.questionMaster = {
    top5: getTop5(Object.values(stats.users), 5, 'questionCount'),
    metric: 'questionCount'
  }

  // LARP Sage: Most LARP-related content
  achievements.larpSage = {
    top5: getTop5(Object.values(stats.users), 5, 'larpContent'),
    metric: 'larpContent'
  }

  // Meme Lord: Most active in meme channels
  achievements.memeLord = {
    top5: getTop5(Object.values(stats.users), 5, 'memeChannelMessages'),
    metric: 'memeChannelMessages'
  }

  // Emoji Enthusiast: Most unique emojis used
  const emojiEnthusiastCandidates = Object.values(stats.users)
    .map(user => ({ ...user, uniqueEmojiCount: user.uniqueEmojis.size }))

  achievements.emojiEnthusiast = {
    top5: getTop5(emojiEnthusiastCandidates, 10, 'uniqueEmojiCount'),
    metric: 'uniqueEmojiCount'
  }

  // Word Smith: Longest average message length
  const wordSmithCandidates = Object.values(stats.users)
    .filter(user => user.messageCount >= 10)
    .map(user => ({
      ...user,
      avgMessageLength: user.messageLengths.length > 0 ?
        user.totalMessageLength / user.messageLengths.length : 0
    }))

  achievements.wordSmith = {
    top5: getTop5(wordSmithCandidates, 10, 'avgMessageLength'),
    metric: 'avgMessageLength'
  }

  // Message Volume Champion: Most total characters typed
  achievements.messageVolume = {
    top5: getTop5(Object.values(stats.users), 20, 'totalMessageLength'),
    metric: 'totalMessageLength'
  }

  // Build final stats object
  const finalStats = {
    summary: {
      totalMessages: stats.totalMessages,
      uniqueUsers: stats.uniqueUsers.size,
      totalChannels: Object.keys(stats.channels).length,
      dateRange: stats.dateRange,
    },
    achievements,
    topUsers,
    topReactors,
    topMediaUsers,
    topChannels,
    activity: {
      byHour: stats.activityByHour,
      byDay: stats.activityByDay,
      byMonth: stats.activityByMonth,
      peakHour: stats.activityByHour.indexOf(Math.max(...stats.activityByHour)),
      peakDay: stats.activityByDay.indexOf(Math.max(...stats.activityByDay)),
      peakMonth: stats.activityByMonth.indexOf(Math.max(...stats.activityByMonth)),
    },
    topReactions,
    topWords,
    attachments: stats.attachments,
    emojis: stats.emojis,
    larp: {
      topRoles,
      topFactions,
      topThemes,
    },
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // Write stats to file
  fs.writeFileSync(outputPath, JSON.stringify(finalStats, null, 2))
  
  console.log(`\n✅ Stats generated successfully!`)
  console.log(`   Output: ${outputPath}`)
  console.log(`\nSummary:`)
  console.log(`   Total Messages: ${finalStats.summary.totalMessages.toLocaleString()}`)
  console.log(`   Unique Users: ${finalStats.summary.uniqueUsers}`)
  console.log(`   Channels: ${finalStats.summary.totalChannels}`)
  console.log(`   Top User: ${finalStats.topUsers[0]?.name} (${finalStats.topUsers[0]?.messageCount.toLocaleString()} messages)`)
}

aggregateStats()
