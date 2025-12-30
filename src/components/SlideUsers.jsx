import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideUsers({ stats }) {
  const topUsers = stats?.topUsers?.slice(0, 10) || []


  if (!stats || !topUsers.length) {
    return (
      <div className="slide">
        <div className="slide-content">
          <h2 className="slide-title">Most Active Members</h2>
          <p className="slide-subtitle">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Active Members</h2>
        <p className="slide-subtitle">Top contributors of 2025</p>
        <div className="user-list">
          {topUsers.map((user, index) => (
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
                <div className="user-stat">
                  {user.messageCount.toLocaleString()} messages
                  {user.reactionCount > 0 && ` • ${user.reactionCount.toLocaleString()} reactions received`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideUsers


