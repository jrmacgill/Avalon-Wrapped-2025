import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideFFXIV({ stats }) {
  const ffxiv = stats?.ffxiv || {}
  const topJobs = ffxiv.topJobs || []
  const topRaids = ffxiv.topRaids || []
  const topContent = ffxiv.topContent || []

  // Map job names to icon filenames (data uses lowercase)
  const getJobIcon = (jobName) => {
    const iconMap = {
      'bard': 'Bard.png',
      'bluemage': 'BlueMage.png',
      'dancer': 'Dancer.png',
      'monk': 'Monk.png',
      'ninja': 'Ninja.png',
      'reaper': 'Reaper.png',
      'sage': 'Sage.png',
      'scholar': 'Scholar.png',
      'summoner': 'Summoner.png',
      'warrior': 'Warrior.png'
    }
    return iconMap[jobName.toLowerCase().replace(/\s+/g, '')] || null
  }

  // Map raid content to icon filenames
  const getRaidIcon = (raidName) => {
    const raidIconMap = {
      'savage': 'savage.png',
      'unreal': 'unreal.png',
      'dungeon': 'dungeon.png',
      'ultimate': 'ultimate.png',
      'extreme': 'extreme.png',
      'alliance': 'alliance.png',
      'trial': 'trial.png'
    }
    // Try different matching strategies
    const lowerName = raidName.toLowerCase()
    const icon = raidIconMap[lowerName] ||
                 raidIconMap[Object.keys(raidIconMap).find(key => lowerName.includes(key))]
    return icon || null
  }

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
              {topJobs.map((item, index) => {
                const iconFile = getJobIcon(item.job)
                return (
                  <div key={item.job} className="stat-card ffxiv-job-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    {iconFile && (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        margin: '0 auto 1rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={`${import.meta.env.BASE_URL}assets/${iconFile}`}
                          alt={`${item.job} icon`}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <div className="stat-card-title">{item.job}</div>
                    <div className="stat-card-value">{item.count.toLocaleString()}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {topRaids.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--ffxiv-gold)', marginBottom: '1rem' }}>
              Raid Content Mentions
            </h3>
            <div className="stat-grid">
              {topRaids.map((item, index) => {
                const raidIconFile = getRaidIcon(item.raid)
                return (
                  <div key={item.raid} className="stat-card ffxiv-raid-card" style={{ animationDelay: `${index * 0.1}s` }}>
                    {raidIconFile && (
                      <div style={{
                        width: '60px',
                        height: '60px',
                        margin: '0 auto 1rem',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <img
                          src={`${import.meta.env.BASE_URL}assets/${raidIconFile}`}
                          alt={`${item.raid} icon`}
                          style={{
                            width: '50px',
                            height: '50px',
                            objectFit: 'contain'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                    <div className="stat-card-title">{item.raid}</div>
                    <div className="stat-card-value">{item.count.toLocaleString()}</div>
                  </div>
                )
              })}
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


