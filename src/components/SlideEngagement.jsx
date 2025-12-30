import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideEngagement({ stats }) {
  const topUsers = stats?.topUsers?.slice(0, 5) || []

  const calculateEngagementScore = (user) => {
    return user.messageCount + (user.reactionCount * 2) + (user.attachmentCount * 3)
  }

  const engagementUsers = topUsers.map(user => ({
    ...user,
    engagementScore: calculateEngagementScore(user)
  })).sort((a, b) => b.engagementScore - a.engagementScore)

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Engaged Members</h2>
        <p className="slide-subtitle">Messages + Reactions + Attachments</p>
        <div className="user-list">
          {engagementUsers.map((user, index) => (
            <div key={user.id} className="user-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="user-rank">#{index + 1}</div>
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              )}
              <div className="user-info">
                <div className="user-name">{user.nickname || user.name}</div>
                <div className="user-stat" style={{ marginBottom: '0.5rem' }}>
                  {user.engagementScore.toLocaleString()} engagement points
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--guild-text-dim)' }}>
                  {user.messageCount} msgs • {user.reactionCount} reactions • {user.attachmentCount} attachments
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideEngagement

