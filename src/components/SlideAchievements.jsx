import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideAchievements({ stats }) {
  const summary = stats?.summary || {}
  const attachments = stats?.attachments || {}
  const topUsers = stats?.topUsers || []
  const topReactors = stats?.topReactors || []
  const topMediaUsers = stats?.topMediaUsers || []
  const statsAchievements = stats?.achievements || {}


  // Check if we have the required data
  if (!stats || !topUsers.length) {
    return (
      <div className="slide">
        <div className="slide-content">
          <h2 className="slide-title">Community Achievements</h2>
          <p className="slide-subtitle">Loading achievement data...</p>
        </div>
      </div>
    )
  }

  // Find user with most attachments
  const mediaMaster = topUsers.find(u => u.attachmentCount === Math.max(...topUsers.map(u => u.attachmentCount || 0)))

  // Calculate engagement scores and find top contributor
  const engagementScores = topUsers.map(user => ({
    ...user,
    engagementScore: (user.messageCount || 0) + (user.reactionCount || 0) * 2 + (user.attachmentCount || 0) * 3
  }))
  const topContributor = engagementScores.reduce((max, user) =>
    user.engagementScore > max.engagementScore ? user : max,
    engagementScores[0]
  )

  // Find additional award winners
  const mostPopular = topUsers.find(u => u.reactionCount === Math.max(...topUsers.map(u => u.reactionCount)))

  // Helper function to format metric values
  const formatMetric = (user, metric) => {
    if (!user) return 'N/A'

    try {
      switch (metric) {
        case 'reactionRatio':
          return user.reactionCount && user.reactionRatio ?
            `${user.reactionCount} reactions (${user.reactionRatio.toFixed(1)}x ratio)` : 'N/A'
        case 'nightMessages':
          return user.nightMessages ? `${user.nightMessages} messages` : '0 messages'
        case 'morningMessages':
          return user.morningMessages ? `${user.morningMessages} messages` : '0 messages'
        case 'weekendMessages':
          return user.weekendMessages ? `${user.weekendMessages} messages` : '0 messages'
        case 'channelCount':
          return user.channelCount ? `${user.channelCount} channels` : '0 channels'
        case 'uniqueMentionCount':
          return user.uniqueMentionCount ? `${user.uniqueMentionCount} users` : '0 users'
        case 'replyCount':
          return user.replyCount ? `${user.replyCount} replies` : '0 replies'
        case 'questionCount':
          return user.questionCount ? `${user.questionCount} questions` : '0 questions'
        case 'ffxivContent':
          return user.ffxivContent ? `${user.ffxivContent} posts` : '0 posts'
        case 'memeChannelMessages':
          return user.memeChannelMessages ? `${user.memeChannelMessages} posts` : '0 posts'
        case 'uniqueEmojiCount':
          return user.uniqueEmojiCount ? `${user.uniqueEmojiCount} unique emojis` : '0 emojis'
        case 'avgMessageLength':
          return user.avgMessageLength ? `${Math.round(user.avgMessageLength)} chars avg` : 'N/A'
        default:
          return 'N/A'
      }
    } catch (error) {
      console.error('Error formatting metric:', error, user, metric)
      return 'N/A'
    }
  }

  const achievements = [
    {
      title: "🏆 Most Dedicated",
      description: "Sent the most messages",
      top5: topUsers.slice(0, 5).map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: user?.messageCount?.toLocaleString() || '0',
        isWinner: index === 0
      }))
    },
    {
      title: "⭐ Most Popular",
      description: "Received the most reactions",
      top5: topReactors.slice(0, 5).map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: user?.reactionCount?.toLocaleString() || '0',
        isWinner: index === 0
      }))
    },
    {
      title: "📸 Media Master",
      description: "Shared the most attachments",
      top5: topMediaUsers.slice(0, 5).map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: user?.attachmentCount?.toLocaleString() || '0',
        isWinner: index === 0
      }))
    },
    {
      title: "😊 Emoji Enthusiast",
      description: "Uses the most unique emojis",
      top5: statsAchievements.emojiEnthusiast?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements.emojiEnthusiast.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "👀 Lurker Award",
      description: "Reacts more than they message",
      top5: statsAchievements?.lurker?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.lurker?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "🦉 Night Owl",
      description: "Most active 11PM-5AM",
      top5: statsAchievements?.nightOwl?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.nightOwl?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "🌅 Early Bird",
      description: "Most active 5AM-11AM",
      top5: statsAchievements?.earlyBird?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.earlyBird?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "⚔️ Weekend Warrior",
      description: "Most active on weekends",
      top5: statsAchievements?.weekendWarrior?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.weekendWarrior?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "🏄 Channel Surfer",
      description: "Active in most channels",
      top5: statsAchievements?.channelSurfer?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.channelSurfer?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "🦋 Social Butterfly",
      description: "Mentions most unique users",
      top5: statsAchievements?.socialButterfly?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.socialButterfly?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "🔄 Reply Master",
      description: "Most replies to others",
      top5: statsAchievements?.replyMaster?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.replyMaster?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "🌱 Most Sprout-Coded",
      description: "Asks the most questions",
      top5: statsAchievements?.questionMaster?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.questionMaster?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "🧙 FFXIV Sage",
      description: "Most FFXIV content",
      top5: statsAchievements?.ffxivSage?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.ffxivSage?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "🤡 Resident Clown",
      description: "Most active in memes",
      top5: statsAchievements?.memeLord?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.memeLord?.metric),
        isWinner: index === 0
      })) || []
    },
    {
      title: "📝 Wordsmith",
      description: "Longest average messages",
      top5: statsAchievements?.wordSmith?.top5?.map((user, index) => ({
        rank: index + 1,
        name: user?.nickname || user?.name || 'Unknown',
        value: formatMetric(user, statsAchievements?.wordSmith?.metric),
        isWinner: index === 0
      })) || []
    }
  ]

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">🏆 Community Achievements</h2>
        <p className="slide-subtitle">Celebrating our standout members of 2025</p>
        <div className="stat-grid" style={{
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          padding: '1rem 0'
        }}>
          {achievements.map((achievement, index) => (
            <div key={achievement.title} className="stat-card" style={{
              animationDelay: `${index * 0.1}s`,
              padding: '1.5rem'
            }}>
              <div className="stat-card-title" style={{
                fontSize: '1.6rem',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {achievement.title}
              </div>
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--guild-text-dim)',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {achievement.description}
              </div>

              {achievement.top5 && Array.isArray(achievement.top5) && achievement.top5.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {achievement.top5.map((person, personIndex) => (
                    <div
                      key={person.rank}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        background: person.isWinner ?
                          'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(249, 115, 22, 0.05))' :
                          'rgba(255, 255, 255, 0.02)',
                        border: person.isWinner ? '1px solid var(--guild-orange)' : 'none'
                      }}
                    >
                      <div style={{
                        fontSize: '1.2rem',
                        color: person.isWinner ? '#FFD700' : person.rank === 2 ? '#C0C0C0' : person.rank === 3 ? '#CD7F32' : 'var(--guild-text-dim)',
                        fontWeight: person.isWinner ? 'bold' : 'normal',
                        minWidth: '35px',
                        textAlign: 'center'
                      }}>
                        #{person.rank}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: person.isWinner ? '1rem' : '0.9rem',
                          fontWeight: person.isWinner ? 'bold' : 'normal',
                          color: 'var(--guild-text)',
                          marginBottom: '0.1rem'
                        }}>
                          {person.name}
                        </div>
                        <div style={{
                          fontSize: '0.75rem',
                          color: 'var(--guild-text-dim)'
                        }}>
                          {person.value}
                        </div>
                      </div>
                      {person.isWinner && (
                        <div style={{
                          fontSize: '1.2rem',
                          color: '#FFD700',
                          textShadow: '0 0 8px rgba(255, 215, 0, 0.5)'
                        }}>
                          👑
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: 'var(--guild-text-dim)',
                  fontSize: '0.9rem',
                  padding: '1rem'
                }}>
                  No data available
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideAchievements

