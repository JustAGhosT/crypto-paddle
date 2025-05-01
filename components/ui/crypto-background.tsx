"use client"

import { useEffect, useRef } from "react"

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  type: "dot" | "symbol"
  symbol?: string
}

interface ChartLine {
  x: number
  y: number
  width: number
  angle: number
  speed: number
  opacity: number
}

export default function CryptoBackground() {
  const particlesRef = useRef<Particle[]>([])
  const chartLinesRef = useRef<ChartLine[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()

  // Crypto symbols
  const cryptoSymbols = ["₿", "Ξ", "₮", "Ł", "Ð", "₳", "◎", "Ꞓ"]

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initialize particles
    const initParticles = () => {
      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      // Create particles
      particlesRef.current = []
      for (let i = 0; i < 30; i++) {
        const isSymbol = Math.random() < 0.3 // 30% chance to be a symbol
        const size = isSymbol ? 14 : Math.random() * 3 + 1

        // Only add particles that are not too small and filter out yellow dots
        // We'll completely skip creating small particles rather than just filtering by size
        if (isSymbol || (size > 3 && Math.random() > 0.2)) {
          particlesRef.current.push({
            x: Math.random() * containerWidth,
            y: Math.random() * containerHeight,
            size: size,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            opacity: Math.random() * 0.5 + 0.1,
            type: isSymbol ? "symbol" : "dot",
            symbol: isSymbol ? cryptoSymbols[Math.floor(Math.random() * cryptoSymbols.length)] : undefined,
          })
        }
      }

      // Create chart lines
      chartLinesRef.current = []
      for (let i = 0; i < 8; i++) {
        chartLinesRef.current.push({
          x: Math.random() * containerWidth,
          y: Math.random() * containerHeight,
          width: Math.random() * 200 + 100,
          angle: Math.random() * 40 - 20, // -20 to 20 degrees
          speed: Math.random() * 0.5 + 0.2,
          opacity: Math.random() * 0.3 + 0.1,
        })
      }
    }

    // Animation loop
    const animate = () => {
      if (!container) return

      const containerWidth = container.clientWidth
      const containerHeight = container.clientHeight

      // Update particles
      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = containerWidth
        if (particle.x > containerWidth) particle.x = 0
        if (particle.y < 0) particle.y = containerHeight
        if (particle.y > containerHeight) particle.y = 0

        // Create or update DOM elements
        let element = document.getElementById(`particle-${particlesRef.current.indexOf(particle)}`)
        if (!element) {
          element = document.createElement("div")
          element.id = `particle-${particlesRef.current.indexOf(particle)}`
          element.className = "finance-particle absolute"
          container.appendChild(element)
        }

        if (particle.type === "dot") {
          element.style.width = `${particle.size}px`
          element.style.height = `${particle.size}px`
          element.style.backgroundColor = `rgba(97, 174, 238, ${particle.opacity})`
          element.textContent = ""
        } else {
          element.style.width = "auto"
          element.style.height = "auto"
          element.style.backgroundColor = "transparent"
          element.style.color = `rgba(97, 174, 238, ${particle.opacity})`
          element.style.fontSize = `${particle.size}px`
          element.textContent = particle.symbol || ""
        }

        element.style.left = `${particle.x}px`
        element.style.top = `${particle.y}px`
        element.style.opacity = particle.opacity.toString()
      })

      // Update chart lines
      chartLinesRef.current.forEach((line) => {
        line.y += line.speed

        // Reset when off screen
        if (line.y > containerHeight) {
          line.y = -20
          line.x = Math.random() * containerWidth
          line.width = Math.random() * 200 + 100
          line.angle = Math.random() * 40 - 20
        }

        // Create or update DOM elements
        let element = document.getElementById(`chart-line-${chartLinesRef.current.indexOf(line)}`)
        if (!element) {
          element = document.createElement("div")
          element.id = `chart-line-${chartLinesRef.current.indexOf(line)}`
          element.className = "chart-line absolute"
          container.appendChild(element)
        }

        element.style.width = `${line.width}px`
        element.style.left = `${line.x}px`
        element.style.top = `${line.y}px`
        element.style.transform = `rotate(${line.angle}deg)`
        element.style.opacity = line.opacity.toString()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Handle resize
    const handleResize = () => {
      initParticles()
    }

    // Initialize and start animation
    initParticles()
    animate()
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }

      // Remove all particle elements
      particlesRef.current.forEach((_, index) => {
        const element = document.getElementById(`particle-${index}`)
        if (element) element.remove()
      })

      // Remove all chart line elements
      chartLinesRef.current.forEach((_, index) => {
        const element = document.getElementById(`chart-line-${index}`)
        if (element) element.remove()
      })

      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-0" />
}
