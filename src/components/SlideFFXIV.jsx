import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideFFXIV({ stats }) {
  const ffxiv = stats?.ffxiv || {}
  const topJobs = ffxiv.topJobs || []
  const topRaids = ffxiv.topRaids || []
  const topContent = ffxiv.topContent || []

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">FFXIV Highlights</h2>
        <p className="slide-subtitle">Your Free Company's adventures in Eorzea</p>
        
        {topJobs.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--ffxiv-gold)', marginBottom: '1rem' }}>
              Most Mentioned Jobs
            </h3>
            <div className="stat-grid">
              {topJobs.map((item, index) => (
                <div key={item.job} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="stat-card-title">{item.job}</div>
                  <div className="stat-card-value">{item.count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {topRaids.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--ffxiv-gold)', marginBottom: '1rem' }}>
              Raid Content Mentions
            </h3>
            <div className="stat-grid">
              {topRaids.map((item, index) => (
                <div key={item.raid} className="stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="stat-card-title">{item.raid}</div>
                  <div className="stat-card-value">{item.count.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {topContent.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--ffxiv-gold)', marginBottom: '1rem' }}>
              Content Mentions
            </h3>
            <div className="word-cloud">
              {topContent.map((item, index) => (
                <span
                  key={item.content}
                  className="word-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.content} ({item.count.toLocaleString()})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlideFFXIV


