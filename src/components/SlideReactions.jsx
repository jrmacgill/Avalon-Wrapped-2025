import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideReactions({ stats }) {
  const topReactions = stats?.topReactions?.slice(0, 10) || []

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Reacted Messages</h2>
        <p className="slide-subtitle">The messages that got the most love</p>

        <div className="reactions-grid">
          {topReactions.map((msg, index) => (
            <div
              key={`${msg.messageId}-${index}`}
              className={`reaction-card ${!msg.content ? 'no-screenshot' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="reaction-screenshot">
                <img
                  src={`${import.meta.env.BASE_URL}assets/Most_Reacted_Messages_${index + 1}.png`}
                  alt={`Most reacted message ${index + 1}`}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              </div>

              <div className="reaction-content">
                <div className="reaction-author">
                  <div className="reaction-rank">#{index + 1}</div>
                  <div className="reaction-name">{msg.author}</div>
                </div>

                {msg.content && (
                  <div className="reaction-text">
                    {msg.content}
                  </div>
                )}

                <div className="reaction-meta">
                  <div className="reaction-count">
                    {msg.reactionCount} reactions
                  </div>
                  <div className="reaction-channel">
                    #{msg.channel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideReactions


