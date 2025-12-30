import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideChannels({ stats }) {
  const topChannels = stats?.topChannels?.slice(0, 10) || []

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Active Channels</h2>
        <p className="slide-subtitle">Where the conversation happened</p>
        <div className="stat-grid">
          {topChannels.map((channel, index) => (
            <div key={`${channel.category}-${channel.name}`} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-card-title">
                #{channel.name}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--ffxiv-text-dim)', marginBottom: '0.5rem' }}>
                {channel.category}
              </div>
              <div className="stat-card-value">
                {channel.messageCount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideChannels


