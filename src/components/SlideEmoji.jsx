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
        <p className="slide-subtitle">DED's emoji language decoded</p>

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

        {/* Most Used Emojis in Messages */}
        {topMessageEmojis.length > 0 && (
          <div className="chart-container">
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--guild-orange)' }}>Most Used Emojis in Messages</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topMessageEmojis.map(([emoji, count], index) => (
                <div key={emoji} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--guild-bg-card)',
                  borderRadius: '8px',
                  border: '1px solid rgba(75, 85, 99, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '2rem'
                    }}>
                      {renderEmoji(emoji, '1.5rem')}
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--guild-text)' }}>
                      #{index + 1}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--ffxiv-text)' }}>
                      {count.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--guild-text-dim)' }}>
                      uses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Most Used Emojis in Reactions */}
        {topReactionEmojis.length > 0 && (
          <div className="chart-container" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--guild-orange)' }}>Most Used Emojis in Reactions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topReactionEmojis.map(([emoji, count], index) => (
                <div key={emoji} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--guild-bg-card)',
                  borderRadius: '8px',
                  border: '1px solid rgba(75, 85, 99, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '2rem'
                    }}>
                      {renderEmoji(emoji, '1.5rem')}
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--guild-text)' }}>
                      #{index + 1}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--ffxiv-text)' }}>
                      {count.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--guild-text-dim)' }}>
                      reactions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Emojis */}
        {topCustomEmojis.length > 0 && (
          <div className="chart-container" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--guild-orange)' }}>Popular Custom Emojis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topCustomEmojis.map(([emoji, count], index) => (
                <div key={emoji} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--guild-bg-card)',
                  borderRadius: '8px',
                  border: '1px solid rgba(75, 85, 99, 0.3)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '2rem'
                    }}>
                      {renderEmoji(emoji, '1.5rem')}
                    </div>
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--guild-text)' }}>
                      #{index + 1}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--ffxiv-text)' }}>
                      {count.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--guild-text-dim)' }}>
                      uses
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlideEmoji