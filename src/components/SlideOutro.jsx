import { useState } from 'react'
import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideOutro({ stats }) {
  const [activeSection, setActiveSection] = useState(null) // 'credits' or 'faq'
  const [expandedQuestions, setExpandedQuestions] = useState({})

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section)
  }

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }
  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Thanks for an amazing 1125!</h2>
        <p className="slide-subtitle" style={{ fontSize: '1.8rem', marginTop: '2rem' }}>
          Here's to another year of adventures in Eorzea
        </p>

        <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
          <img
            src={`${import.meta.env.BASE_URL}assets/end_cardL.jpg`}
            alt="End Card"
            style={{
              maxWidth: '100%',
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

        {/* Credits and FAQ Section */}
        <div style={{ textAlign: 'center', marginTop: '3rem' }}>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => toggleSection('credits')}
              style={{
                background: activeSection === 'credits' ? 'var(--guild-orange)' : 'var(--guild-bg-card)',
                border: '2px solid var(--guild-orange)',
                color: activeSection === 'credits' ? 'var(--guild-bg-dark)' : 'var(--guild-orange)',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '120px'
              }}
            >
              Credits {activeSection === 'credits' ? '▼' : '▶'}
            </button>

            <button
              onClick={() => toggleSection('faq')}
              style={{
                background: activeSection === 'faq' ? 'var(--guild-orange)' : 'var(--guild-bg-card)',
                border: '2px solid var(--guild-orange)',
                color: activeSection === 'faq' ? 'var(--guild-bg-dark)' : 'var(--guild-orange)',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minWidth: '120px'
              }}
            >
              FAQ {activeSection === 'faq' ? '▼' : '▶'}
            </button>
          </div>

          {/* Credits Content */}
          {activeSection === 'credits' && (
            <div style={{
              maxWidth: '600px',
              margin: '0 auto',
              background: 'var(--guild-bg-card)',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              borderRadius: '8px',
              padding: '1.5rem',
              marginBottom: '1rem'
            }}>
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
                  <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Analytics Library:</span> Chat-analytics
                </div>
                <div>
                  <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Programmer & Creative Director:</span> Zi
                </div>
                <div>
                  <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>DED Beta Testers:</span> Thorn, Val Reina, A Cade, Cleo "League Dealer" Linieh, AArekin AAlatus
                </div>
                <div>
                  <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Presentation Magic:</span> React & D3
                </div>
                <div>
                  <span style={{ color: 'var(--guild-orange)', fontWeight: 'bold' }}>Coding Fuel:</span> Cold Brew & FFXIV Music
                </div>
              </div>
            </div>
          )}

          {/* FAQ Content */}
          {activeSection === 'faq' && (
            <div style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'left'
            }}>
              {/* How was this made? */}
              <div style={{
                background: 'var(--guild-bg-card)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '8px',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => toggleQuestion('how-made')}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'var(--guild-text)',
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>How was this made?</span>
                  <span style={{
                    color: 'var(--guild-orange)',
                    fontSize: '1.2rem',
                    transition: 'transform 0.3s ease'
                  }}>
                    {expandedQuestions['how-made'] ? '▼' : '▶'}
                  </span>
                </button>
                {expandedQuestions['how-made'] && (
                  <div style={{
                    padding: '0 1rem 1rem 1rem',
                    color: 'var(--guild-text-dim)',
                    lineHeight: '1.6'
                  }}>
                    <p>This Avalon Wrapped 1125 presentation was built using modern web technologies and custom data analysis tools.</p>

                    <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Data Collection:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      <li>Discord data was scraped from the DED server by our custom Discord bot <strong>Zi&apos;s Mammet</strong></li>
                      <li>Covered the full year: <strong>January 1, 2025 to December 31, 2025</strong></li>
                      <li>Includes all messages, reactions, and user interactions across all channels</li>
                    </ul>

                    <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>Libraries & Tools Used:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      <li><strong>React</strong> - Interactive user interface framework</li>
                      <li><strong>D3.js</strong> - Data visualization and charting</li>
                      <li><strong>Chat-analytics</strong> - Discord message analysis library</li>
                      <li><strong>Vite</strong> - Fast build tool and development server</li>
                      <li><strong>Node.js</strong> - JavaScript runtime environment</li>
                      <li><strong>Discord.js</strong> - Bot framework for data collection</li>
                    </ul>

                    <p style={{ marginTop: '1rem' }}>
                      The entire process runs locally on your machine for maximum privacy and security. All data processing, analysis, and visualization happens client-side with no external data transmission.
                    </p>
                  </div>
                )}
              </div>

              {/* Is all our data private? */}
              <div style={{
                background: 'var(--guild-bg-card)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                borderRadius: '8px',
                marginBottom: '1rem',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => toggleQuestion('data-privacy')}
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    color: 'var(--guild-text)',
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>Is all our data private?</span>
                  <span style={{
                    color: 'var(--guild-orange)',
                    fontSize: '1.2rem',
                    transition: 'transform 0.3s ease'
                  }}>
                    {expandedQuestions['data-privacy'] ? '▼' : '▶'}
                  </span>
                </button>
                {expandedQuestions['data-privacy'] && (
                  <div style={{
                    padding: '0 1rem 1rem 1rem',
                    color: 'var(--guild-text-dim)',
                    lineHeight: '1.6'
                  }}>
                    <p>Yes, your Discord data remains completely private and secure. Here's how:</p>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      <li><strong>Local Processing Only:</strong> All data analysis happens on your local machine using npm scripts. Nothing is uploaded to external servers.</li>
                      <li><strong>No Raw Data on GitHub:</strong> Your original Discord JSON files stay on your computer. Only processed, aggregated statistics are stored in the repository.</li>
                      <li><strong>Anonymous Results:</strong> The final presentation shows community insights and trends, but no individual messages, personal data, or identifiable information.</li>
                      <li><strong>Open Source Transparency:</strong> You can review the processing code yourself to see exactly how your data is handled.</li>
                    </ul>
                    <p style={{ marginTop: '0.5rem' }}>
                      Your privacy is our priority - this tool was built to celebrate your community while keeping everything secure and private.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SlideOutro


