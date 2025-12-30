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
        <div className="user-list">
          {topReactions.map((msg, index) => (
            <div key={`${msg.messageId}-${index}`} className="user-item" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="user-rank">⭐</div>
              <div className="user-info">
                <div className="user-name">{msg.author}</div>
                <div className="user-stat" style={{ marginBottom: '0.5rem' }}>
                  {msg.content || '(no text content)'}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--ffxiv-gold)' }}>
                  {msg.reactionCount} reactions • #{msg.channel}
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


