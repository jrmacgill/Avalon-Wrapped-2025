import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideActivity({ stats }) {
  const activityByHour = stats?.activity?.byHour || []
  const activityByDay = stats?.activity?.byDay || []
  const activityByMonth = stats?.activity?.byMonth || []
  const peakHour = stats?.activity?.peakHour ?? 0
  const peakDay = stats?.activity?.peakDay ?? 0
  const peakMonth = stats?.activity?.peakMonth ?? 0

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const hourLabels = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 || 12
    const period = i < 12 ? 'AM' : 'PM'
    return `${hour}${period}`
  })

  const maxHour = Math.max(...activityByHour)
  const maxDay = Math.max(...activityByDay)
  const maxMonth = Math.max(...activityByMonth)

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Activity Patterns</h2>
        <p className="slide-subtitle">When DED was most active</p>
        
        <div className="chart-container">
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--guild-orange)' }}>Peak Hour: {hourLabels[peakHour]}</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '200px' }}>
            {activityByHour.map((count, hour) => {
              const height = (count / maxHour) * 100
              return (
                <div
                  key={hour}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    background: hour === peakHour
                      ? 'var(--gradient-red)'
                      : 'var(--gradient-grey)',
                    borderRadius: '4px 4px 0 0',
                    minHeight: '4px',
                    transition: 'all 0.3s ease',
                  }}
                  title={`${hourLabels[hour]}: ${count.toLocaleString()} messages`}
                />
              )
            })}
          </div>
        </div>

        <div className="chart-container" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--guild-orange)' }}>
            Peak Day: {dayNames[peakDay]}
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px' }}>
            {activityByDay.map((count, day) => {
              const height = (count / maxDay) * 100
              return (
                <div
                  key={day}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    background: day === peakDay
                      ? 'var(--gradient-red)'
                      : 'var(--gradient-grey)',
                    borderRadius: '8px 8px 0 0',
                    minHeight: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '8px',
                    alignItems: 'center',
                  }}
                  title={`${dayNames[day]}: ${count.toLocaleString()} messages`}
                >
                  <div style={{ fontSize: '0.7rem', color: 'var(--guild-text)', marginBottom: '4px' }}>
                    {dayNames[day].substring(0, 3)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="chart-container" style={{ marginTop: '2rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--guild-orange)' }}>
            Peak Month: {monthNames[peakMonth]}
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '200px' }}>
            {activityByMonth.map((count, month) => {
              const height = (count / maxMonth) * 100
              return (
                <div
                  key={month}
                  style={{
                    flex: 1,
                    height: `${height}%`,
                    background: month === peakMonth
                      ? 'var(--gradient-red)'
                      : 'var(--gradient-grey)',
                    borderRadius: '6px 6px 0 0',
                    minHeight: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '6px',
                    alignItems: 'center',
                  }}
                  title={`${monthNames[month]}: ${count.toLocaleString()} messages`}
                >
                  <div style={{ fontSize: '0.65rem', color: 'var(--guild-text)', marginBottom: '2px' }}>
                    {monthNames[month].substring(0, 3)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlideActivity


