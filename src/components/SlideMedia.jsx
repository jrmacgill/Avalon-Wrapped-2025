import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideMedia({ stats }) {
  const attachments = stats?.attachments || {}
  const topUsers = stats?.topUsers || []
  const totalMessages = stats?.summary?.totalMessages || 0

  // Get top media sharers (sorted by attachmentCount, not messageCount)
  const topMediaSharers = [...topUsers]
    .filter(user => user.attachmentCount > 0)
    .sort((a, b) => b.attachmentCount - a.attachmentCount)
    .slice(0, 5)

  // Calculate media insights
  const mediaMessageRatio = totalMessages > 0 ? (attachments.total / totalMessages) * 100 : 0
  const imagesPercentage = attachments.total > 0 ? (attachments.images / attachments.total) * 100 : 0
  const videosPercentage = attachments.total > 0 ? (attachments.videos / attachments.total) * 100 : 0
  const otherPercentage = attachments.total > 0 ? (attachments.other / attachments.total) * 100 : 0

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Media Shared</h2>

        {/* Big number display */}
        <div className="big-number">{attachments.total?.toLocaleString() || 0}</div>
        <p className="slide-subtitle">pieces of media shared in 1125</p>

        {/* Media type breakdown with progress bars */}
        <div className="media-breakdown">
          <div className="media-type">
            <div className="media-type-header">
              <span className="media-icon">📷</span>
              <span className="media-label">Images</span>
              <span className="media-count">{attachments.images?.toLocaleString() || 0}</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar images"
                style={{ width: `${imagesPercentage}%` }}
              />
            </div>
            <div className="percentage">{imagesPercentage.toFixed(1)}%</div>
          </div>

          <div className="media-type">
            <div className="media-type-header">
              <span className="media-icon">🎥</span>
              <span className="media-label">Videos</span>
              <span className="media-count">{attachments.videos?.toLocaleString() || 0}</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar videos"
                style={{ width: `${videosPercentage}%` }}
              />
            </div>
            <div className="percentage">{videosPercentage.toFixed(1)}%</div>
          </div>

          <div className="media-type">
            <div className="media-type-header">
              <span className="media-icon">📎</span>
              <span className="media-label">Other Files</span>
              <span className="media-count">{attachments.other?.toLocaleString() || 0}</span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar other"
                style={{ width: `${otherPercentage}%` }}
              />
            </div>
            <div className="percentage">{otherPercentage.toFixed(1)}%</div>
          </div>
        </div>

        {/* Media insights */}
        <div className="media-insights">
          <div className="stat-card">
            <div className="stat-card-title">Media Message Ratio</div>
            <div className="stat-card-value">{mediaMessageRatio.toFixed(1)}%</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--ffxiv-text-dim)', marginTop: '0.5rem' }}>
              of messages contained media
            </div>
          </div>
        </div>

        {/* Top media sharers */}
        {topMediaSharers.length > 0 && (
          <div className="top-media-section">
            <h3 style={{
              color: 'var(--guild-orange)',
              fontSize: '1.5rem',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              Most Prolific Media Sharers
            </h3>
            <div className="user-list">
              {topMediaSharers.map((user, index) => (
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
                      {user.attachmentCount.toLocaleString()} attachments shared
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlideMedia


