import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideRoles({ stats }) {
  const roles = stats?.discordRoles || []

  // Filter out common/generic roles and TEMP/BACKEND roles
  const topRoles = roles
    .filter(role => 
      role.name !== '@everyone' && 
      role.name !== '@here' && 
      !role.name.includes('TEMP') &&
      !role.name.includes('BACKEND')
    )
    .slice(0, 25)

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Active Roles</h2>
        <p className="slide-subtitle">Ranked by messages per member</p>

        <div className="stat-grid">
          {topRoles.map((role, index) => (
            <div 
              key={role.name} 
              className="stat-card"
              style={{ 
                animationDelay: `${index * 0.05}s`,
                borderColor: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : 'rgba(75, 85, 99, 0.4)'
              }}
            >
              <div 
                className="stat-card-title"
                style={{ 
                  color: role.color ? `#${role.color.toString(16).padStart(6, '0')}` : 'var(--guild-orange)',
                  fontSize: '1.1rem',
                  marginBottom: '0.3rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={role.name}
              >
                {role.name}
              </div>
              <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>
                {role.messagesPerUser?.toLocaleString() || Math.round(role.count / Math.max(role.activeUsers, 1)).toLocaleString()}
                <span style={{ fontSize: '0.8rem', color: 'var(--guild-text-dim)', marginLeft: '5px' }}>msg/member</span>
              </div>
              <div style={{ 
                fontSize: '0.8rem', 
                color: 'var(--guild-text-dim)',
                marginTop: '0.3rem',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{role.count.toLocaleString()} total</span>
                <span>{role.activeUsers} members</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideRoles
