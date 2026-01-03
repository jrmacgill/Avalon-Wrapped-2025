import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideRoles({ stats }) {
  const roles = stats?.discordRoles || []

  // Filter out common/generic roles and TEMP roles
  const topRoles = roles
    .filter(role => 
      role.name !== '@everyone' && 
      role.name !== '@here' && 
      !role.name.includes('TEMP')
    )
    .slice(0, 25)

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Active Roles</h2>
        <p className="slide-subtitle">The groups that kept the conversation going</p>

        <div className="stat-grid">
          {topRoles.map((role, index) => (
            <div 
              key={role.name} 
              className="stat-card"
              style={{ 
                animationDelay: `${index * 0.05}s`, // Faster animation for more items
                borderColor: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : 'rgba(75, 85, 99, 0.4)'
              }}
            >
              <div 
                className="stat-card-title"
                style={{ 
                  color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : 'var(--guild-orange)',
                  fontSize: '1.1rem', // Slightly smaller font to fit more
                  marginBottom: '0.3rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={role.name}
              >
                {role.name}
              </div>
              <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>{role.count.toLocaleString()}</div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'var(--guild-text-dim)',
                marginTop: '0.3rem'
              }}>
                {role.activeUsers} active members
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideRoles
