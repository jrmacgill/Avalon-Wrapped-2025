import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideIntro({ stats }) {
  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img
            src="/assets/guild_banner.jpg"
            alt="DED Guild Banner"
            style={{
              width: '100%',
              maxWidth: '700px',
              height: 'auto',
              borderRadius: '16px',
              border: '4px solid var(--guild-red)',
              boxShadow: '0 12px 40px rgba(220, 38, 38, 0.4)',
              marginBottom: '2rem'
            }}
          />
        </div>
        <h1 className="slide-title" style={{
          background: 'var(--gradient-red)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 20px rgba(220, 38, 38, 0.5)',
          marginBottom: '1rem'
        }}>
          Your DED 2025 Wrapped
        </h1>
        <p className="slide-subtitle" style={{ marginBottom: '2rem' }}>
          A year in review for Dead on Arrival
        </p>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--guild-text-dim)' }}>
            Press → or Space to continue
          </p>
        </div>
      </div>
    </div>
  )
}

export default SlideIntro


