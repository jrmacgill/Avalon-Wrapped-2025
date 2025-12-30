import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideOutro({ stats }) {
  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Thanks for an amazing 2025!</h2>
        <p className="slide-subtitle" style={{ fontSize: '1.8rem', marginTop: '2rem' }}>
          Here's to another year of adventures in Eorzea
        </p>

        <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
          <img
            src="/assets/end_cardL.jpg"
            alt="End Card"
            style={{
              maxWidth: '120%',
              maxHeight: '450px',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              animation: 'fadeInUp 1s ease-out'
            }}
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--ffxiv-text-dim)' }}>
            Dead on Arrival
          </p>
          <p style={{ fontSize: '1rem', color: 'var(--ffxiv-text-dim)', marginTop: '1rem' }}>
            2025
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <h3 style={{
            fontSize: '1.4rem',
            color: 'var(--guild-orange)',
            marginBottom: '1.5rem',
            fontWeight: 'bold'
          }}>
            Credits
          </h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            alignItems: 'center',
            fontSize: '1rem',
            color: 'var(--guild-text)'
          }}>
            <div>
              <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Data Scraping:</span> Zi's Mammet
            </div>
            <div>
              <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Analytics Engine:</span> ChatAnalytics.app
            </div>
            <div>
              <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Creative Director:</span> Aarekin
            </div>
            <div>
              <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>DED Officers:</span> Thorn, Val Reina, A Cade, Cleo "League Dealer" Linieh
            </div>
            <div>
              <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Community Feedback:</span> The DED Fam
            </div>
            <div>
              <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Presentation Magic:</span> React & D3
            </div>
            <div>
              <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Late Night Fuel:</span> Cold Brew Coffee & FFXIV
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SlideOutro


