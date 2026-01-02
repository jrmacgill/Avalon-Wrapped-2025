import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideTimeline({ stats }) {
  const summary = stats?.summary || {}
  const topUsers = stats?.topUsers || []
  const activityByMonth = stats?.activity?.byMonth || []

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const fullMonthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  // Calculate conversation evolution metrics
  const totalMessages = summary.totalMessages || 0
  const totalUsers = summary.uniqueUsers || 0

  // Find users with reply/question data
  const usersWithReplyData = topUsers.filter(user => user.replyCount !== undefined && user.questionCount !== undefined)

  // Calculate average reply rate and question rate over time
  const avgRepliesPerUser = usersWithReplyData.length > 0
    ? Math.round(usersWithReplyData.reduce((sum, user) => sum + (user.replyCount || 0), 0) / usersWithReplyData.length)
    : 0

  const avgQuestionsPerUser = usersWithReplyData.length > 0
    ? Math.round(usersWithReplyData.reduce((sum, user) => sum + (user.questionCount || 0), 0) / usersWithReplyData.length)
    : 0

  // Growth visualization - message accumulation over months
  const cumulativeMessages = []
  let runningTotal = 0
  for (const count of activityByMonth) {
    runningTotal += count
    cumulativeMessages.push(runningTotal)
  }

  // Find measurable milestone points in the data
  const monthlyThreshold = 10000 // First month with 10k+ messages (significant jump)
  const accelerationMonth = activityByMonth.findIndex(count => count >= monthlyThreshold) // April (month 3)

  // Community evolution milestones - all tied to graph markers
  const evolutionMilestones = [
    {
      period: "Volume Surge",
      milestone: `First ${monthlyThreshold.toLocaleString()}+ Messages/Month`,
      description: `Activity exploded in ${fullMonthNames[accelerationMonth]}`,
      value: `${activityByMonth[accelerationMonth].toLocaleString()} messages`,
      icon: "🚀",
      phase: "acceleration",
      color: "var(--guild-blue)",
      graphMonth: accelerationMonth,
      graphIcon: "🚀"
    },
    {
      period: "Halfway Point",
      milestone: "50% of 2025 Messages",
      description: "Community reached the midpoint of the year's conversation",
      value: `${(totalMessages * 0.5).toLocaleString()} messages reached`,
      icon: "🎯",
      phase: "milestone",
      color: "var(--guild-orange)",
      graphMonth: cumulativeMessages.findIndex(count => count >= totalMessages * 0.5),
      graphIcon: "🎯"
    },
    {
      period: "Reply Peak",
      milestone: `${avgRepliesPerUser} Avg Replies/User Reached`,
      description: "Conversations became more interactive and engaging",
      value: "Reply Culture Emerged",
      icon: "💬",
      phase: "conversational",
      color: "var(--guild-green)",
      graphMonth: 6, // July - when activity surged
      graphIcon: "💬"
    },
    {
      period: "Question Boom",
      milestone: `${avgQuestionsPerUser} Avg Questions/User Reached`,
      description: "Community curiosity and knowledge sharing peaked",
      value: "Learning Culture Flourished",
      icon: "🤔",
      phase: "curious",
      color: "var(--guild-purple)",
      graphMonth: 10, // November - holiday discussion period
      graphIcon: "🤔"
    }
  ]

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Conversation Evolution</h2>
        <p className="slide-subtitle">How our community conversations changed over 2025</p>

        {/* Cumulative Growth Chart */}
        <div className="timeline-growth-chart">
          <h3 style={{
            color: 'var(--guild-orange)',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '1.5rem'
          }}>
            Message Accumulation Through 2025
          </h3>
          <div
            className="growth-chart-container"
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            {cumulativeMessages.map((count, month) => {
              const maxCumulative = Math.max(...cumulativeMessages)
              const heightPercent = count > 0 ? (count / maxCumulative) * 100 : 0
              const minHeightPx = 10 // Minimum 10px height for visibility
              const maxHeightPx = 200 // Maximum height (container is 250px with padding)
              const heightPx = Math.max((heightPercent / 100) * maxHeightPx, minHeightPx)

              // Check if this month has any milestone markers
              const milestoneHere = evolutionMilestones.find(m => m.graphMonth === month)
              const halfwayPoint = count >= totalMessages * 0.5 && cumulativeMessages[month - 1] < totalMessages * 0.5

              return (
                <div key={month} className="month-bar-container">
                  <div
                    className={`month-bar ${halfwayPoint || milestoneHere ? 'milestone' : ''}`}
              style={{
                      height: `${heightPx}px`,
                      background: halfwayPoint
                        ? 'var(--gradient-orange)'
                        : milestoneHere
                        ? milestoneHere.phase === 'acceleration' ? 'var(--gradient-grey)' :
                          milestoneHere.phase === 'milestone' ? 'var(--gradient-orange)' :
                          milestoneHere.phase === 'conversational' ? 'var(--gradient-grey)' :
                          'var(--gradient-grey)'
                        : 'var(--gradient-grey)'
                    }}
                    title={`${monthNames[month]}: ${count.toLocaleString()} total messages`}
                  >
                    {milestoneHere && (
                      <div className="season-indicator">{milestoneHere.graphIcon}</div>
                    )}
              </div>
                  <div className="month-label">{monthNames[month]}</div>
                  <div className="month-count">{count > 0 ? count.toLocaleString() : ''}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Evolution Milestones */}
        <div className="timeline-milestones">
          <h3 style={{
            color: 'var(--guild-orange)',
            textAlign: 'center',
            marginBottom: '2rem',
            fontSize: '1.5rem'
                }}>
            Community Evolution Milestones
          </h3>
          <div className="milestones-grid">
            {evolutionMilestones.map((milestone, index) => (
              <div
                key={milestone.period}
                className={`milestone-card ${milestone.phase}`}
                style={{
                  animationDelay: `${index * 0.2}s`,
                  borderColor: milestone.color,
                  boxShadow: `0 0 20px ${milestone.color}20`
                }}
              >
                <div className="milestone-icon">{milestone.icon}</div>
                <div className="milestone-content">
                  <div className="milestone-period">{milestone.period}</div>
                  <div className="milestone-milestone">{milestone.milestone}</div>
                  <div className="milestone-description">{milestone.description}</div>
                  <div className="milestone-value">{milestone.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evolution Insights */}
        <div className="timeline-insights">
          <div className="insight-card">
            <div className="insight-icon">📚</div>
            <div className="insight-content">
              <div className="insight-title">Knowledge Hub</div>
              <div className="insight-value">{Math.round((avgQuestionsPerUser / avgRepliesPerUser) * 100)}%</div>
              <div className="insight-desc">Questions vs replies ratio</div>
            </div>
        </div>

          <div className="insight-card">
            <div className="insight-icon">🔗</div>
            <div className="insight-content">
              <div className="insight-title">Conversation Depth</div>
              <div className="insight-value">{avgRepliesPerUser}</div>
              <div className="insight-desc">Average replies per member</div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-icon">🌱</div>
            <div className="insight-content">
              <div className="insight-title">Community Growth</div>
              <div className="insight-value">{totalUsers}</div>
              <div className="insight-desc">Active contributors in 2025</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlideTimeline

