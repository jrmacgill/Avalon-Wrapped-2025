import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'
import { useState } from 'react'

function SlideReactions({ stats }) {
  const topReactions = stats?.topReactions?.slice(0, 10) || []
  const [enlargedImage, setEnlargedImage] = useState(null)


  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} />
      <div className="slide-content">
        <h2 className="slide-title">Most Reacted Messages</h2>
        <p className="slide-subtitle">The messages that got the most love</p>

        <div className="reactions-grid">
          {topReactions.map((msg, index) => (
            <div
              key={`${msg.messageId}-${index}`}
              className="reaction-card"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setEnlargedImage(index)}
            >
              <div className="reaction-screenshot">
                <img
                  src={`/assets/Most_Reacted_Messages_${index + 1}.png`}
                  alt={`Most reacted message ${index + 1}`}
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '8px',
                    objectFit: 'contain'
                  }}
                />
              </div>

              <div className="reaction-content">
                <div className="reaction-author">
                  <div className="reaction-rank">#{index + 1}</div>
                  <div className="reaction-name">{msg.author}</div>
                </div>

                {msg.content && (
                  <div className="reaction-text">
                    {msg.content}
                  </div>
                )}

                <div className="reaction-meta">
                  <div className="reaction-count">
                    {msg.reactionCount} reactions
                  </div>
                  <div className="reaction-channel">
                    #{msg.channel}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enlarged Image Modal */}
        {enlargedImage !== null && (
          <div
            className="enlarged-image-overlay"
            onClick={() => setEnlargedImage(null)}
          >
            <div className="enlarged-image-container">
              <img
                src={`/assets/Most_Reacted_Messages_${enlargedImage + 1}.png`}
                alt={`Enlarged reaction message ${enlargedImage + 1}`}
                className="enlarged-image"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="enlarged-image-close"
                onClick={() => setEnlargedImage(null)}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlideReactions


