import { useState, useEffect, useRef, useMemo } from 'react'

function FloatingGhosts({ count = 5, delayStart = 0 }) {
  const [animationStarted, setAnimationStarted] = useState(false)
  const animationRef = useRef()
  const ghostElementsRef = useRef([])
  const startTimeRef = useRef(Date.now())

  // Use a stable seed based on slide count to ensure consistent positioning
  const stableSeed = Math.floor(count / 3) * 3

  const ghosts = useMemo(() => {
    return Array.from({ length: Math.min(count, 10) }, (_, index) => {
      // Use deterministic values based on stable seed and index
      // Increased multipliers for better distribution with more ghosts
      const seed1 = (stableSeed * 7 + index * 19) % 100;
      const seed2 = (stableSeed * 11 + index * 23) % 100;
      const seed3 = (stableSeed * 19 + index * 23) % 100;
      const seed4 = (stableSeed * 29 + index * 31) % 100;

      const seed5 = (stableSeed * 37 + index * 41) % 100;
      const seed6 = (stableSeed * 43 + index * 47) % 100;

      const baseLeft = (seed1 / 100) * 80 + 10;
      const baseTop = (seed2 / 100) * 70 + 15;

      return {
        id: `ghost-${stableSeed}-${index}`,
        baseLeft, // 10% to 90% from left (better distribution)
        baseTop, // 15% to 85% from top (better distribution)
        size: (seed3 / 100) * 50 + 40, // 40px to 90px (doubled)
        phase: (index * 0.5) * Math.PI, // Staggered phases
        speed: (0.3 + (seed1 / 100) * 0.4) * 2.25, // 0.675-1.575 speed (50% faster again)
        opacity: 0.06 + (seed2 / 100) * 0.06, // 0.06 to 0.12 opacity
        flipped: (seed4 % 2) === 0, // Random horizontal flip
        // Random drift velocities (pixels per second)
        driftX: ((seed5 - 50) / 50) * 15, // -15 to +15 px/s horizontal drift
        driftY: ((seed6 - 50) / 50) * 10, // -10 to +10 px/s vertical drift
        // Track current drift position
        currentDriftX: 0,
        currentDriftY: 0,
      }
    })
  }, [stableSeed])

  useEffect(() => {
    const animate = () => {
      try {
        const currentTime = Date.now()
        const elapsed = (currentTime - startTimeRef.current) / 1000 // seconds

        // Update each ghost's position
        ghostElementsRef.current.forEach((element, index) => {
          if (element && ghosts[index]) {
            const ghost = ghosts[index]

            // Update drift position (accumulate over time)
            ghost.currentDriftX += (ghost.driftX || 0) * (1/60) // Assume 60fps
            ghost.currentDriftY += (ghost.driftY || 0) * (1/60)

            // Boundary checking - bounce back when reaching edges
            const maxDrift = 80 // Maximum drift distance in pixels
            if (Math.abs(ghost.currentDriftX) > maxDrift) {
              ghost.currentDriftX = Math.sign(ghost.currentDriftX) * maxDrift * 0.9
              ghost.driftX *= -0.8 // Reverse and dampen velocity
            }
            if (Math.abs(ghost.currentDriftY) > maxDrift) {
              ghost.currentDriftY = Math.sign(ghost.currentDriftY) * maxDrift * 0.9
              ghost.driftY *= -0.8 // Reverse and dampen velocity
            }

            // Calculate floating motion
            const time = elapsed * (ghost.speed || 1)
            const floatY = Math.sin(time + (ghost.phase || 0)) * 4 // -4px to +4px
            const floatX = Math.cos(time * 0.7 + (ghost.phase || 0)) * 2 // -2px to +2px
            const rotation = Math.sin(time * 0.3 + (ghost.phase || 0)) * 0.5 // -0.5° to +0.5°

            // Combine drift and floating motion
            const totalX = (ghost.currentDriftX || 0) + floatX
            const totalY = (ghost.currentDriftY || 0) + floatY

            const flipScale = ghost.flipped ? -1 : 1
            const transformValue = `translate(-50%, -50%) scaleX(${flipScale}) translate(${totalX}px, ${totalY}px) rotate(${rotation}deg)`

            // Apply both positioning and transform
            element.style.left = `${ghost.baseLeft}%`
            element.style.top = `${ghost.baseTop}%`
            element.style.transform = transformValue

          }
        })

      } catch (error) {
        console.error('Ghost animation error:', error)
        // Stop animation on error
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }

    // Start animation with optional delay
    const startAnimation = () => {
      setAnimationStarted(true)
      startTimeRef.current = Date.now()
      animationRef.current = setInterval(animate, 1000 / 60) // 60fps
    }

    if (delayStart > 0) {
      const delayTimer = setTimeout(startAnimation, delayStart)
      return () => {
        clearTimeout(delayTimer)
        if (animationRef.current) {
          clearInterval(animationRef.current)
        }
      }
    } else {
      startAnimation()
      return () => {
        if (animationRef.current) {
          clearInterval(animationRef.current)
        }
      }
    }
  }, [ghosts])

  if (!animationStarted) {
    return null // Don't render ghosts until animation starts
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 10,
      overflow: 'visible'
    }}>
      {ghosts.map((ghost, index) => (
        <div
          key={ghost.id}
          ref={(el) => ghostElementsRef.current[index] = el}
          style={{
            position: 'absolute',
            left: `${ghost.left}%`,
            top: `${ghost.top}%`,
            width: `${ghost.size}px`,
            height: `${ghost.size}px`,
            opacity: ghost.opacity,
            transform: 'translate(-50%, -50%)',
            willChange: 'transform',
          }}
        >
          <img
            src="/assets/ghost_transparent.png"
            alt=""
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default FloatingGhosts
