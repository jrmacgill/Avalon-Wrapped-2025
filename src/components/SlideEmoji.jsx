import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideEmoji({ stats }) {
  const emojis = stats?.emojis || {}
  const achievements = stats?.achievements || {}
  const topUsers = stats?.topUsers || []

  // Helper function to render an emoji (custom or Unicode)
  const renderEmoji = (emojiKey, size = '1.5rem') => {
    // Check if it's a custom emoji (format: name:id)
    if (typeof emojiKey === 'string' && emojiKey.includes(':')) {
      const emojiData = emojis.messageCustomEmojis?.[emojiKey] || emojis.reactionCustomEmojis?.[emojiKey]
      if (emojiData) {
        const extension = emojiData.animated ? 'gif' : 'png'
        const imageUrl = `https://cdn.discordapp.com/emojis/${emojiData.id}.${extension}`
        return (
          <img
            src={imageUrl}
            alt={emojiData.name}
            style={{
              width: size,
              height: size,
              objectFit: 'contain',
              verticalAlign: 'middle'
            }}
            onError={(e) => {
              // Fallback to text if image fails to load
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'inline'
            }}
          />
        )
      }
    }

    // Unicode emoji - just display as text
    return <span style={{ fontSize: size, lineHeight: 1 }}>{emojiKey}</span>
  }

  // Convert custom emojis to count format for ranking
  const messageCustomEmojisCount = Object.entries(emojis.messageCustomEmojis || {}).map(([key, data]) => [key, data.count])
  const reactionCustomEmojisCount = Object.entries(emojis.reactionCustomEmojis || {}).map(([key, data]) => [key, data.count])

  // Get top message emojis (combine Unicode and custom)
  const allMessageEmojis = [...Object.entries(emojis.messageEmojis || {}), ...messageCustomEmojisCount]
  const topMessageEmojis = allMessageEmojis
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)

  // Get top reaction emojis (combine Unicode and custom)
  const allReactionEmojis = [...Object.entries(emojis.reactionEmojis || {}), ...reactionCustomEmojisCount]
  const topReactionEmojis = allReactionEmojis
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)

  // Get top combined emojis (messages + reactions)
  const allCombinedEmojis = [...allMessageEmojis, ...allReactionEmojis]
    .reduce((acc, [emoji, count]) => {
      acc[emoji] = (acc[emoji] || 0) + count
      return acc
    }, {})
  const topCombinedEmojis = Object.entries(allCombinedEmojis)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)

  // Get top custom emojis (combined from messages and reactions)
  const allCustomEmojis = [...messageCustomEmojisCount, ...reactionCustomEmojisCount]
  const topCustomEmojis = allCustomEmojis
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)

  // Calculate emoji statistics
  const totalMessageEmojis = Object.values(emojis.messageEmojis || {}).reduce((sum, count) => sum + count, 0) +
                            Object.values(emojis.messageCustomEmojis || {}).reduce((sum, emoji) => sum + emoji.count, 0)
  const totalReactionEmojis = Object.values(emojis.reactionEmojis || {}).reduce((sum, count) => sum + count, 0) +
                             Object.values(emojis.reactionCustomEmojis || {}).reduce((sum, emoji) => sum + emoji.count, 0)
  const totalCustomEmojis = Object.values(emojis.messageCustomEmojis || {}).reduce((sum, emoji) => sum + emoji.count, 0) +
                           Object.values(emojis.reactionCustomEmojis || {}).reduce((sum, emoji) => sum + emoji.count, 0)
  const uniqueMessageEmojis = Object.keys(emojis.messageEmojis || {}).length + Object.keys(emojis.messageCustomEmojis || {}).length
  const uniqueReactionEmojis = Object.keys(emojis.reactionEmojis || {}).length + Object.keys(emojis.reactionCustomEmojis || {}).length
  const uniqueCustomEmojis = Object.keys(emojis.messageCustomEmojis || {}).length + Object.keys(emojis.reactionCustomEmojis || {}).length

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Used Emoji</h2>
        <p className="slide-subtitle">Deez Nuts emoji language decoded</p>

        {/* Emoji Statistics Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-card-title">Total Emojis Used</div>
            <div className="stat-card-value">{(totalMessageEmojis + totalReactionEmojis).toLocaleString()}</div>
            <div className="stat-card-desc">in messages & reactions</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-card-title">Unique Emojis</div>
            <div className="stat-card-value">{(uniqueMessageEmojis + uniqueReactionEmojis).toLocaleString()}</div>
            <div className="stat-card-desc">different emojis used</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'center' }}>
            <div className="stat-card-title">Custom Emojis</div>
            <div className="stat-card-value">{totalCustomEmojis.toLocaleString()}</div>
            <div className="stat-card-desc">Discord custom emojis</div>
          </div>
        </div>

        {/* Emoji Rankings Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>
          {/* Most Used Emojis in Messages */}
          {topMessageEmojis.length > 0 && (
            <div style={{
              background: 'var(--guild-bg-card)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '2px solid rgba(75, 85, 99, 0.3)'
            }}>
              <h3 style={{
                marginBottom: '1rem',
                color: 'var(--guild-orange)',
                fontSize: '1.1rem',
                textAlign: 'center'
              }}>
                Messages
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topMessageEmojis.slice(0, 8).map(([emoji, count], index) => {
                  const maxCount = topMessageEmojis[0][1]
                  const percentage = (count / maxCount) * 100
                  return (
                    <div key={emoji} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {renderEmoji(emoji, '1.2rem')}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: 'var(--guild-text)'
                          }}>
                            #{index + 1}
                          </span>
                          <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--ffxiv-text)',
                            fontWeight: 'bold'
                          }}>
                            {count.toLocaleString()}
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          background: 'rgba(75, 85, 99, 0.2)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--guild-orange), var(--ffxiv-purple))',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Most Used Emojis in Reactions */}
          {topReactionEmojis.length > 0 && (
            <div style={{
              background: 'var(--guild-bg-card)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '2px solid rgba(75, 85, 99, 0.3)'
            }}>
              <h3 style={{
                marginBottom: '1rem',
                color: 'var(--guild-orange)',
                fontSize: '1.1rem',
                textAlign: 'center'
              }}>
                Reactions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topReactionEmojis.slice(0, 8).map(([emoji, count], index) => {
                  const maxCount = topReactionEmojis[0][1]
                  const percentage = (count / maxCount) * 100
                  return (
                    <div key={emoji} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {renderEmoji(emoji, '1.2rem')}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: 'var(--guild-text)'
                          }}>
                            #{index + 1}
                          </span>
                          <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--ffxiv-text)',
                            fontWeight: 'bold'
                          }}>
                            {count.toLocaleString()}
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          background: 'rgba(75, 85, 99, 0.2)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--ffxiv-purple), var(--guild-red))',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Most Used Overall Emojis */}
          {topCombinedEmojis.length > 0 && (
            <div style={{
              background: 'var(--guild-bg-card)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '2px solid rgba(75, 85, 99, 0.3)'
            }}>
              <h3 style={{
                marginBottom: '1rem',
                color: 'var(--guild-orange)',
                fontSize: '1.1rem',
                textAlign: 'center'
              }}>
                Overall Most Used
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {topCombinedEmojis.map(([emoji, count], index) => {
                  const maxCount = topCombinedEmojis[0][1]
                  const percentage = (count / maxCount) * 100
                  return (
                    <div key={emoji} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {renderEmoji(emoji, '1.2rem')}
                      </div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <span style={{
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: 'var(--guild-text)'
                          }}>
                            #{index + 1}
                          </span>
                          <span style={{
                            fontSize: '0.8rem',
                            color: 'var(--ffxiv-text)',
                            fontWeight: 'bold'
                          }}>
                            {count.toLocaleString()}
                          </span>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          background: 'rgba(75, 85, 99, 0.2)',
                          borderRadius: '3px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--guild-orange), var(--ffxiv-purple), var(--guild-red))',
                            borderRadius: '3px',
                            transition: 'width 0.5s ease'
                          }} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Popular Custom Emojis */}
          {topCustomEmojis.length > 0 && (
            <div style={{
              background: 'var(--guild-bg-card)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '2px solid rgba(75, 85, 99, 0.3)',
              gridColumn: '1 / -1' // Span full width
            }}>
              <h3 style={{
                marginBottom: '1rem',
                color: 'var(--guild-orange)',
                fontSize: '1.1rem',
                textAlign: 'center'
              }}>
                Popular Custom Emojis
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem'
              }}>
                {topCustomEmojis.slice(0, 12).map(([emoji, count], index) => {
                  const maxCount = topCustomEmojis[0][1]
                  const percentage = (count / maxCount) * 100
                  return (
                    <div key={emoji} style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem',
                      background: 'rgba(0, 0, 0, 0.2)',
                      borderRadius: '8px'
                    }}>
                      <div style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {renderEmoji(emoji, '1.5rem')}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        color: 'var(--guild-text)',
                        textAlign: 'center'
                      }}>
                        #{index + 1}
                      </div>
                      <div style={{
                        width: '100%',
                        height: '4px',
                        background: 'rgba(75, 85, 99, 0.2)',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: 'var(--guild-orange)',
                          borderRadius: '2px',
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--ffxiv-text)',
                        fontWeight: 'bold'
                      }}>
                        {count.toLocaleString()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SlideEmoji