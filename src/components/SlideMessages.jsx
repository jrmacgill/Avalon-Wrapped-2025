import { useState, useEffect, useMemo, useRef } from 'react'
import '../styles/Slide.css'
import FloatingGhosts from './FloatingGhosts'

function SlideMessages({ stats }) {
  const [count, setCount] = useState(0)
  const [avgCount, setAvgCount] = useState(0)
  const [perUserCount, setPerUserCount] = useState(0)
  const [showAverage, setShowAverage] = useState(false)
  const [showPerUser, setShowPerUser] = useState(false)

  // Use refs to track if animations have already run
  const hasAnimatedTotal = useRef(false)
  const hasAnimatedAverage = useRef(false)
  const hasAnimatedPerUser = useRef(false)


  // Memoize calculated values to prevent unnecessary recalculations
  const target = useMemo(() => stats?.summary?.totalMessages || 0, [stats?.summary?.totalMessages])

  const avgTarget = useMemo(() => {
    const dateRange = stats?.summary?.dateRange
    if (!dateRange?.earliest || !dateRange?.latest) return 0

    const startDate = new Date(dateRange.earliest)
    const endDate = new Date(dateRange.latest)
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))

    return daysDiff > 0 ? Math.round(target / daysDiff) : 0
  }, [stats?.summary?.dateRange, target])

  const perUserTarget = useMemo(() => {
    const uniqueUsers = stats?.summary?.uniqueUsers || 1
    return Math.round(target / uniqueUsers)
  }, [stats?.summary?.uniqueUsers, target])

  // First animation: Total Messages
  useEffect(() => {
    if (target <= 0) return

    const duration = 2000
    const steps = 60
    const increment = target / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
        // Start the second animation after a short delay
        setTimeout(() => setShowAverage(true), 500)
      } else {
        setCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [target])

  // Second animation: Average Messages Per Day
  useEffect(() => {
    if (!showAverage || hasAnimatedAverage.current) return

    hasAnimatedAverage.current = true
    const duration = 1500
    const steps = 45
    const increment = avgTarget / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= avgTarget) {
        setAvgCount(avgTarget)
        clearInterval(timer)
        // Start the third animation after a short delay
        setTimeout(() => setShowPerUser(true), 500)
      } else {
        setAvgCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [showAverage, avgTarget])

  // Third animation: Messages Per Active User
  useEffect(() => {
    if (!showPerUser || hasAnimatedPerUser.current) return

    hasAnimatedPerUser.current = true
    const duration = 1200
    const steps = 36
    const increment = perUserTarget / steps
    const stepDuration = duration / steps

    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= perUserTarget) {
        setPerUserCount(perUserTarget)
        clearInterval(timer)
      } else {
        setPerUserCount(Math.floor(current))
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [showPerUser, perUserTarget])

  return (
    <div className="slide">
      <FloatingGhosts count={Math.floor(Math.random() * 8) + 3} delayStart={5000} />
      <div className="slide-content">
        <div style={{ marginBottom: (showAverage || showPerUser) ? '2rem' : '0' }}>
          <h2 className="slide-title">Total Messages</h2>
          <div className="big-number">{count.toLocaleString()}</div>
          <p className="slide-subtitle">
            messages sent across {stats?.summary?.totalChannels || 0} channels
          </p>
        </div>

        {showAverage && (
          <div style={{
            animation: 'fadeInUp 0.8s ease-out',
            marginTop: showPerUser ? '1.5rem' : '2rem',
            marginBottom: showPerUser ? '1.5rem' : '0'
          }}>
            <h2 className="slide-title" style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>
              Average Messages Per Day
            </h2>
            <div className="big-number" style={{ fontSize: '4rem' }}>
              {avgCount.toLocaleString()}
            </div>
            <p className="slide-subtitle" style={{ fontSize: '1.1rem' }}>
              messages per day throughout 1125
            </p>
          </div>
        )}

        {showPerUser && (
          <div style={{
            animation: 'fadeInUp 0.8s ease-out',
            marginTop: '1.5rem'
          }}>
            <h2 className="slide-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Messages Per Active User
            </h2>
            <div className="big-number" style={{ fontSize: '3.5rem' }}>
              {perUserCount.toLocaleString()}
            </div>
            <p className="slide-subtitle" style={{ fontSize: '1rem' }}>
              average messages per community member
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SlideMessages


