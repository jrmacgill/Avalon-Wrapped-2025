import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideFFXIV({ stats }) {
  const larp = stats?.larp || {}
  const topRoles = larp.topRoles || []
  const topFactions = larp.topFactions || []
  const topThemes = larp.topThemes || []

  // Check if we have any data to display
  const hasData = topRoles.length > 0 || topFactions.length > 0 || topThemes.length > 0

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Deez Nuts Higlights</h2>
        <p className="slide-subtitle">Who are we Worshipping</p>
        
        {!hasData && (
          <div style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.8 }}>
            <p>No LARP-related keywords detected in 2025 messages.</p>
            <p style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
              (Try running <code>npm run process-data</code> again if you just updated the keywords)
            </p>
          </div>
        )}

        {topRoles.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--ffxiv-gold)', marginBottom: '1rem' }}>
              Most Mentioned Roles
            </h3>
            <div className="stat-grid">
              {topRoles.map((item, index) => {
                return (
                  <div key={item.role} className="stat-card ffxiv-job-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="stat-card-title" style={{ textTransform: 'capitalize' }}>{item.role}</div>
                  <div className="stat-card-value">{item.count.toLocaleString()}</div>
                </div>
                )
              })}
            </div>
          </div>
        )}

        {topFactions.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--ffxiv-gold)', marginBottom: '1rem' }}>
              Faction Mentions
            </h3>
            <div className="stat-grid">
              {topFactions.map((item, index) => {
                return (
                  <div key={item.faction} className="stat-card ffxiv-raid-card" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="stat-card-title" style={{ textTransform: 'capitalize' }}>{item.faction}</div>
                  <div className="stat-card-value">{item.count.toLocaleString()}</div>
                </div>
                )
              })}
            </div>
          </div>
        )}

        {topThemes.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--ffxiv-gold)', marginBottom: '1rem' }}>
              Thematic Mentions
            </h3>
            <div className="word-cloud">
              {topThemes.map((item, index) => (
                <span
                  key={item.theme}
                  className="word-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.theme} ({item.count.toLocaleString()})
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
