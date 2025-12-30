import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'
import { useMemo } from 'react'

function SlideWords({ stats }) {
  const topWords = stats?.topWords?.slice(0, 40) || []

  // Top words list
  const topListWords = useMemo(() => topWords.slice(0, 15), [topWords])

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Used Words</h2>
        <p className="slide-subtitle">The words that defined 2025</p>

        {/* Top Words List */}
        <div className="top-words-list">
          {topListWords.map((item, index) => (
            <div
              key={item.word}
              className="top-word-item"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <span className="word-rank">#{index + 1}</span>
              <span className="word-text">{item.word}</span>
              <span className="word-count">{item.count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SlideWords