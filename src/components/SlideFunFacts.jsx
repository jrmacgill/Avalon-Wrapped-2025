import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideFunFacts({ stats }) {
  const summary = stats?.summary || {}
  const topUsers = stats?.topUsers || []
  const activityByHour = stats?.activity?.byHour || []

  // Find users with comprehensive data for unique insights
  const usersWithData = topUsers.filter(user =>
    user.totalMessageLength !== undefined &&
    user.messageLengths !== undefined &&
    user.replyCount !== undefined &&
    user.questionCount !== undefined &&
    user.uniqueEmojis !== undefined &&
    user.uniqueMentions !== undefined
  )

  // Communication style spectrum - mutually exclusive categories
  const allMessageLengths = usersWithData.flatMap(user => user.messageLengths || [])
  const totalValidMessages = allMessageLengths.filter(len => len > 0).length

  // Mutually exclusive: brevity vs depth (adds to 100%)
  const brevityMessages = allMessageLengths.filter(len => len > 0 && len <= 50).length
  const depthMessages = allMessageLengths.filter(len => len > 50).length // Everything else is depth

  const brevityRatio = totalValidMessages > 0 ? Math.round((brevityMessages / totalValidMessages) * 100) : 0
  const depthRatio = totalValidMessages > 0 ? Math.round((depthMessages / totalValidMessages) * 100) : 0

  // Debug logging
  console.log('Communication Spectrum Debug:')
  console.log('Total valid messages:', totalValidMessages)
  console.log('Brevity (≤50 chars):', brevityMessages, `(${brevityRatio}%)`)
  console.log('Depth (>50 chars):', depthMessages, `(${depthRatio}%)`)
  console.log('Total check:', brevityRatio + depthRatio, '% (should be 100%)')

  // Emoji diversity champion (only if emoji data exists)
  const usersWithEmojiData = usersWithData.filter(user => user.uniqueEmojis && Object.keys(user.uniqueEmojis).length > 0)
  const emojiDiversityUser = usersWithEmojiData.length > 0
    ? usersWithEmojiData.reduce((max, user) => {
        const userEmojiCount = Object.keys(user.uniqueEmojis || {}).length
        const maxEmojiCount = Object.keys(max?.uniqueEmojis || {}).length
        return userEmojiCount > maxEmojiCount ? user : max
      }, usersWithEmojiData[0])
    : null

  // Social network champion (most unique mentions)
  const socialButterfly = usersWithData.reduce((max, user) =>
    (user.uniqueMentions?.length || 0) > (max?.uniqueMentions?.length || 0) ? user : max,
    usersWithData[0]
  )

  // Debug emoji data
  console.log('Emoji data debug:')
  console.log('Users with emoji data:', usersWithEmojiData.length)
  console.log('Emoji diversity user:', emojiDiversityUser)
  if (emojiDiversityUser) {
    console.log('Emoji count:', Object.keys(emojiDiversityUser.uniqueEmojis || {}).length)
  }

  // Communication timing insights
  const totalActivityHours = activityByHour.reduce((sum, count) => sum + count, 0)
  const peakHour = activityByHour.indexOf(Math.max(...activityByHour))
  const quietHour = activityByHour.indexOf(Math.min(...activityByHour.filter(count => count > 0)))
  const peakPercentage = totalActivityHours > 0 ? Math.round((activityByHour[peakHour] / totalActivityHours) * 100) : 0

  // Reply chain analysis
  const avgReplyDepth = usersWithData.length > 0
    ? Math.round(usersWithData.reduce((sum, user) => sum + (user.replyCount || 0), 0) / usersWithData.length)
    : 0

  // Overall communication style metrics
  const totalQuestions = usersWithData.reduce((sum, user) => sum + (user.questionCount || 0), 0)
  const questionDensity = totalValidMessages > 0 ? Math.round((totalQuestions / totalValidMessages) * 100) : 0

  const communicationInsights = [
    {
      icon: "💨",
      title: "Quick Communication",
      value: `${brevityRatio}%`,
      description: `Messages under 50 characters`,
      category: "pace"
    },
    {
      icon: "📚",
      title: "Detailed Communication",
      value: `${depthRatio}%`,
      description: `Messages over 50 characters`,
      category: "depth"
    },
    {
      icon: "❓",
      title: "Question Culture",
      value: `${questionDensity}%`,
      description: `Messages that are questions`,
      category: "curiosity"
    },
    {
      icon: "🔗",
      title: "Conversation Depth",
      value: `${avgReplyDepth}`,
      description: `Average replies per member`,
      category: "depth"
    }
  ]

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">🎭 Communication Styles</h2>
        <p className="slide-subtitle">The diverse personalities in our conversations</p>

        {/* Communication Spectrum Visualization */}
        <div className="communication-spectrum">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="spectrum-label left">
              <span className="spectrum-icon">💨</span>
              <span>Brevity</span>
            </div>

            <div className="spectrum-bar">
              <div className="spectrum-fill-brevity" style={{ width: `${brevityRatio}%` }}>
                <span className="spectrum-percentage">{brevityRatio}%</span>
              </div>
              <div className="spectrum-fill-depth" style={{ width: `${depthRatio}%` }}>
                <span className="spectrum-percentage">{depthRatio}%</span>
              </div>
            </div>

            <div className="spectrum-label right">
              <span>Depth</span>
              <span className="spectrum-icon">📚</span>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--guild-text-dim)', fontSize: '0.9rem' }}>
            Communication balance: {brevityRatio}% quick & efficient, {depthRatio}% detailed & comprehensive
          </div>
        </div>

        {/* Communication Style Overview */}
        <div className="communication-categories">
          <h3 style={{
                color: 'var(--guild-orange)',
                textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '1.5rem'
          }}>
            Communication Style Overview
          </h3>

          <div className="category-grid">
            {communicationInsights.map((insight, index) => (
              <div
                key={insight.title}
                className={`communication-card ${insight.category}`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="card-icon">{insight.icon}</div>
                <div className="card-content">
                  <div className="card-title">{insight.title}</div>
                  <div className="card-value">{insight.value}</div>
                  <div className="card-description">{insight.description}</div>
              </div>
              </div>
            ))}
            </div>
        </div>
      </div>
    </div>
  )
}

export default SlideFunFacts

