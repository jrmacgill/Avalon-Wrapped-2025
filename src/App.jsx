import { useState, useEffect } from 'react'
import './styles/App.css'
import SlideIntro from './components/SlideIntro'
import SlideMessages from './components/SlideMessages'
import SlideUsers from './components/SlideUsers'
import SlideChannels from './components/SlideChannels'
import SlideActivity from './components/SlideActivity'
import SlideReactions from './components/SlideReactions'
import SlideWords from './components/SlideWords'
import SlideEmoji from './components/SlideEmoji'
import SlideMedia from './components/SlideMedia'
import SlideEngagement from './components/SlideEngagement'
import SlideAchievements from './components/SlideAchievements'
import SlideTimeline from './components/SlideTimeline'
import SlideFunFacts from './components/SlideFunFacts'
import SlidePuns from './components/SlidePuns'
import SlideFFXIV from './components/SlideFFXIV'
import SlideOutro from './components/SlideOutro'
import { loadStats } from './utils/dataLoader'

function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load stats:', err)
        setLoading(false)
      })
  }, [])

  const slides = [
    SlideIntro,
    SlideMessages,
    SlideUsers,
    SlideChannels,
    SlideActivity,
    SlideReactions,
    SlideWords,
    SlideEmoji,
    SlideMedia,
    SlideEngagement,
    SlideAchievements,
    SlideTimeline,
    SlideFunFacts,
    SlidePuns,
    SlideFFXIV,
    SlideOutro,
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  // Touch/swipe handling for mobile
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX)

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentSlide < slides.length - 1) {
      handleNext()
    }
    if (isRightSwipe && currentSlide > 0) {
      handlePrev()
    }
  }

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide(currentSlide + 1)
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentSlide > 0) {
          setCurrentSlide(currentSlide - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide, slides.length])

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading your DED 2025 Wrapped...</p>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="error-screen">
        <h1>Unable to load stats</h1>
        <p>Please run: npm run process-data</p>
      </div>
    )
  }

  const CurrentSlideComponent = slides[currentSlide]

  return (
    <div
      className="app"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <CurrentSlideComponent stats={stats} />
      <div className="slide-controls">
        <button 
          onClick={handlePrev} 
          disabled={currentSlide === 0}
          className="nav-button prev"
        >
          ←
        </button>
        <div className="slide-indicator">
          {currentSlide + 1} / {slides.length}
        </div>
        <button 
          onClick={handleNext} 
          disabled={currentSlide === slides.length - 1}
          className="nav-button next"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default App

