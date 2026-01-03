import { useState, useEffect } from 'react'
import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlidePuns({ stats }) {
  const [punData, setPunData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}altani-puns-2025.json`)
      .then(response => response.json())
      .then(data => {
        setPunData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load pun data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="slide">
        <div className="slide-content">
          <h2 className="slide-title">Loading Pun Data...</h2>
        </div>
      </div>
    )
  }

  if (!punData) {
    return (
      <div className="slide">
        <div className="slide-content">
          <h2 className="slide-title">Pun Champion: Devious Altani</h2>
          <p className="slide-subtitle">Pun analysis not available</p>
        </div>
      </div>
    )
  }

  // Show ranks 1, 2, and 3 (top 3 puns)
  const top3Puns = [
    punData.puns[0], // Rank 1
    punData.puns[1], // Rank 2
    punData.puns[2], // Rank 3
  ].filter(Boolean)
  const totalPuns = punData.summary.totalPuns

  return (
    <div className="slide" style={{ paddingTop: '20px' }}>
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content" style={{ paddingBottom: '180px' }}>
        <h2 className="slide-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭 Pun Champion</h2>
        <p className="slide-subtitle" style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>Devious Altani's Masterful Wordplay</p>

        <div style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          background: 'var(--guild-bg-card)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '2px solid var(--guild-orange)'
        }}>
          <div style={{
            fontSize: '3rem',
            color: 'var(--guild-orange)',
            textShadow: '0 0 20px rgba(249, 115, 22, 0.5)',
            marginBottom: '0.25rem'
          }}>
            {totalPuns}
          </div>
          <div style={{
            fontSize: '1.2rem',
            color: 'var(--guild-text)',
            marginBottom: '0.25rem'
          }}>
            Verified Puns in 1125
          </div>
          <div style={{
            fontSize: '0.9rem',
            color: 'var(--guild-text-dim)'
          }}>
            {((totalPuns / punData.summary.totalMessages) * 100).toFixed(1)}% of all messages
          </div>
        </div>

        <h3 style={{
          fontSize: '1.5rem',
          color: 'var(--guild-gold)',
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          🏆 Top 3 Puns of the Year
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {top3Puns.map((pun, index) => (
            <div
              key={pun.rank}
              style={{
                background: 'var(--guild-bg-card)',
                border: '2px solid var(--guild-red)',
                borderRadius: '12px',
                padding: '0.75rem',
                animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                  fontWeight: 'bold',
                  minWidth: '45px'
                }}>
                  #{index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: 'var(--guild-text)',
                    marginBottom: '0.2rem'
                  }}>
                    "{pun.content}"
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: 'var(--guild-text-dim)'
                  }}>
                    {pun.date} • #{pun.channel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlidePuns
