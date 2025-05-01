"use client"

import { useRef, useEffect } from "react"
import { useGameContext } from "@/contexts/game-context"
import type { PowerUpType } from "@/types/game-types"
import { PIXEL_MAP } from "@/utils/pixel-map"
import { LETTER_SPACING, GAME_PHASES, EDUCATIONAL_ELEMENTS, PERFORMANCE_METRICS } from "@/utils/constants"
import { getHighScore, getDailyGamesPlayed, incrementDailyGamesPlayed } from "@/utils/storage"

// Define the PowerUp type
interface PowerUp {
  x: number
  y: number
  dx: number
  dy: number
  type: PowerUpType
  size: number
  active: boolean
  collected: boolean
  rotation: number
  rotationSpeed: number
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const {
    gameState,
    setGameState,
    pixelsRef,
    ballsRef,
    paddlesRef,
    powerUpsRef,
    scaleRef,
    lastMousePosRef,
    mouseSpeedRef,
    pointLossIndicatorsRef,
    deltaTimeRef,
    lastFrameTimeRef,
    walletConnected,
    walletBalance,
    getCurrentLevelTheme,
    captureSignal,
    defendVault,
    makeStrategyDecision,
    updateEducationalProgress,
    updatePerformanceMetrics,
  } = useGameContext()

  // Initialize game when canvas is ready
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Load high score and daily games played from localStorage
    const highScore = getHighScore()
    const { gamesPlayed, lastPlayDate } = getDailyGamesPlayed()

    setGameState((prev) => ({
      ...prev,
      highScore,
      gamesPlayedToday: gamesPlayed,
      lastPlayDate,
    }))

    // Mouse position tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const newMouseX = e.clientX - rect.left
      const newMouseY = e.clientY - rect.top

      // Calculate mouse speed for spin effect
      mouseSpeedRef.current = {
        x: newMouseX - lastMousePosRef.current.x,
        y: newMouseY - lastMousePosRef.current.y,
      }

      lastMousePosRef.current = { x: newMouseX, y: newMouseY }
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    const handleClick = () => {
      // If landing page is showing, hide it and start demo mode
      if (gameState.showLandingPage) {
        setGameState((prev) => ({
          ...prev,
          showLandingPage: false,
        }))
        return
      }

      if (gameState.gameOver) {
        // Check if daily game limit is reached
        if (gameState.gamesPlayedToday >= gameState.dailyGamesLimit) {
          // Cannot start a new game
          return
        }

        // Increment games played today
        const newGamesPlayed = incrementDailyGamesPlayed()

        setGameState((prev) => ({
          ...prev,
          gamesPlayedToday: newGamesPlayed,
          score: 0,
          lives: 3,
          level: 1,
          gameOver: false,
          gameStarted: false,
          demoMode: true,
          scoreMultiplier: 1,
          powerUpTimeRemaining: {},
        }))

        initializeGame(true)
      } else if (!gameState.gameStarted) {
        // Check if daily game limit is reached before starting
        if (gameState.gamesPlayedToday >= gameState.dailyGamesLimit) {
          // Cannot start a new game
          setGameState((prev) => ({ ...prev, gameOver: true }))
          return
        }

        // Increment games played today when starting a new game
        const newGamesPlayed = incrementDailyGamesPlayed()

        setGameState((prev) => ({
          ...prev,
          gameStarted: true,
          demoMode: false,
          gamesPlayedToday: newGamesPlayed,
        }))
      }
    }

    canvas.addEventListener("click", handleClick)

    const resizeCanvas = () => {
      // Define a fixed aspect ratio (16:9)
      const aspectRatio = 16 / 9

      // Get the container dimensions
      const containerWidth = window.innerWidth
      const containerHeight = window.innerHeight

      // Calculate the maximum size that fits while maintaining aspect ratio
      let gameWidth, gameHeight

      if (containerWidth / containerHeight > aspectRatio) {
        // Container is wider than our target aspect ratio
        gameHeight = Math.min(containerHeight, 800) // Cap at 800px height
        gameWidth = gameHeight * aspectRatio
      } else {
        // Container is taller than our target aspect ratio
        gameWidth = Math.min(containerWidth, 1200) // Cap at 1200px width
        gameHeight = gameWidth / aspectRatio
      }

      // Set canvas dimensions
      canvas.width = gameWidth
      canvas.height = gameHeight

      // Center the canvas with CSS
      canvas.style.position = "absolute"
      canvas.style.left = `${(containerWidth - gameWidth) / 2}px`
      canvas.style.top = `${(containerHeight - gameHeight) / 2}px`

      // Update scale reference for game elements
      scaleRef.current = Math.min(gameWidth / 1000, gameHeight / 600)

      // Initialize game with new dimensions
      initializeGame()
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
    }
  }, [
    gameState.showLandingPage,
    gameState.gameOver,
    gameState.gameStarted,
    gameState.gamesPlayedToday,
    gameState.dailyGamesLimit,
  ])

  // Game initialization function
  const initializeGame = (resetLevel = false) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scale = scaleRef.current
    const LARGE_PIXEL_SIZE = 8 * scale
    const SMALL_PIXEL_SIZE = 4 * scale
    const BASE_BALL_SPEED = 5 * scale
    const WORD_SPACING = 2

    // Reset game state if needed
    if (resetLevel) {
      setGameState((prev) => ({
        ...prev,
        score: 0,
        lives: 3,
        level: 1,
        gameOver: false,
        gameStarted: false,
        demoMode: true,
        scoreMultiplier: 1,
        powerUpTimeRemaining: {},
      }))
    }

    // Get current level theme
    const words = getCurrentLevelTheme()

    pixelsRef.current = []
    powerUpsRef.current = []

    const calculateWordWidth = (word: string, pixelSize: number) => {
      return (
        word.split("").reduce((width, letter) => {
          const letterWidth = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]?.[0]?.length ?? 0
          return width + letterWidth * pixelSize + LETTER_SPACING * pixelSize
        }, 0) -
        LETTER_SPACING * pixelSize
      )
    }

    const totalWidthLarge = calculateWordWidth(words[0], LARGE_PIXEL_SIZE)
    const totalWidthSmall = words[1].split(" ").reduce((width, word, index) => {
      return width + calculateWordWidth(word, SMALL_PIXEL_SIZE) + (index > 0 ? WORD_SPACING * SMALL_PIXEL_SIZE : 0)
    }, 0)
    const totalWidth = Math.max(totalWidthLarge, totalWidthSmall)
    const scaleFactor = (canvas.width * 0.8) / totalWidth

    const adjustedLargePixelSize = LARGE_PIXEL_SIZE * scaleFactor
    const adjustedSmallPixelSize = SMALL_PIXEL_SIZE * scaleFactor

    const largeTextHeight = 5 * adjustedLargePixelSize
    const smallTextHeight = 5 * adjustedSmallPixelSize
    const spaceBetweenLines = 5 * adjustedLargePixelSize
    const totalTextHeight = largeTextHeight + spaceBetweenLines + smallTextHeight

    let startY = (canvas.height - totalTextHeight) / 2

    // Generate pixels for each word
    words.forEach((word, wordIndex) => {
      const pixelSize = wordIndex === 0 ? adjustedLargePixelSize : adjustedSmallPixelSize
      const totalWidth =
        wordIndex === 0
          ? calculateWordWidth(word, adjustedLargePixelSize)
          : words[1].split(" ").reduce((width, w, index) => {
              return (
                width +
                calculateWordWidth(w, adjustedSmallPixelSize) +
                (index > 0 ? WORD_SPACING * adjustedSmallPixelSize : 0)
              )
            }, 0)

      let startX = (canvas.width - totalWidth) / 2

      if (wordIndex === 1 && word.includes(" ")) {
        word.split(" ").forEach((subWord) => {
          subWord.split("").forEach((letter) => {
            const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
            if (!pixelMap) return

            for (let i = 0; i < pixelMap.length; i++) {
              for (let j = 0; j < pixelMap[i].length; j++) {
                if (pixelMap[i][j]) {
                  const x = startX + j * pixelSize
                  const y = startY + i * pixelSize

                  // 15% chance for a pixel to have a power-up
                  const hasPowerUp = Math.random() < 0.15
                  const powerUpType = hasPowerUp ? getRandomPowerUpType() : undefined

                  pixelsRef.current.push({
                    x,
                    y,
                    size: pixelSize,
                    hit: false,
                    hasPowerUp,
                    powerUpType,
                  })
                }
              }
            }
            startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
          })
          startX += WORD_SPACING * adjustedSmallPixelSize
        })
      } else {
        word.split("").forEach((letter) => {
          const pixelMap = PIXEL_MAP[letter as keyof typeof PIXEL_MAP]
          if (!pixelMap) return

          for (let i = 0; i < pixelMap.length; i++) {
            for (let j = 0; j < pixelMap[i].length; j++) {
              if (pixelMap[i][j]) {
                const x = startX + j * pixelSize
                const y = startY + i * pixelSize

                // 15% chance for a pixel to have a power-up
                const hasPowerUp = Math.random() < 0.15
                const powerUpType = hasPowerUp ? getRandomPowerUpType() : undefined

                pixelsRef.current.push({
                  x,
                  y,
                  size: pixelSize,
                  hit: false,
                  hasPowerUp,
                  powerUpType,
                })
              }
            }
          }
          startX += (pixelMap[0].length + LETTER_SPACING) * pixelSize
        })
      }
      startY += wordIndex === 0 ? largeTextHeight + spaceBetweenLines : 0
    })

    // Initialize ball position near the top right corner
    const ballStartX = canvas.width * 0.9
    const ballStartY = canvas.height * 0.1

    // Speed increases with level
    const levelSpeedMultiplier = 1 + (gameState.level - 1) * 0.1

    // Initialize with a single ball
    ballsRef.current = [
      {
        x: ballStartX,
        y: ballStartY,
        dx: -BASE_BALL_SPEED * levelSpeedMultiplier,
        dy: BASE_BALL_SPEED * levelSpeedMultiplier,
        radius: adjustedLargePixelSize / 2,
        spin: 0,
        speedMultiplier: levelSpeedMultiplier,
        isGhost: false,
      },
    ]

    const paddleWidth = adjustedLargePixelSize
    const paddleLength = 10 * adjustedLargePixelSize

    paddlesRef.current = [
      {
        x: 0,
        y: canvas.height / 2 - paddleLength / 2,
        width: paddleWidth,
        height: paddleLength,
        targetY: canvas.height / 2 - paddleLength / 2,
        isVertical: true,
        prevPosition: canvas.height / 2 - paddleLength / 2,
        velocity: 0,
        originalWidth: paddleWidth,
        originalHeight: paddleLength,
        isSticky: false,
      },
      {
        x: canvas.width - paddleWidth,
        y: canvas.height / 2 - paddleLength / 2,
        width: paddleWidth,
        height: paddleLength,
        targetY: canvas.height / 2 - paddleLength / 2,
        isVertical: true,
        prevPosition: canvas.height / 2 - paddleLength / 2,
        velocity: 0,
        originalWidth: paddleLength,
        originalHeight: paddleLength,
        isSticky: false,
      },
      {
        x: canvas.width / 2 - paddleLength / 2,
        y: 0,
        width: paddleLength,
        height: paddleWidth,
        targetY: canvas.width / 2 - paddleLength / 2,
        isVertical: false,
        prevPosition: canvas.width / 2 - paddleLength / 2,
        velocity: 0,
        originalWidth: paddleLength,
        originalHeight: paddleWidth,
        isSticky: false,
      },
      {
        x: canvas.width / 2 - paddleLength / 2,
        y: canvas.height - paddleWidth,
        width: paddleLength,
        height: paddleWidth,
        targetY: canvas.width / 2 - paddleLength / 2,
        isVertical: false,
        prevPosition: canvas.width / 2 - paddleLength / 2,
        velocity: 0,
        originalWidth: paddleLength,
        originalHeight: paddleWidth,
        isSticky: false,
      },
    ]

    // Clear point loss indicators
    pointLossIndicatorsRef.current = []
  }

  // Get a random power-up type
  const getRandomPowerUpType = (): PowerUpType => {
    const types = Object.values(PowerUpType).filter((v) => !isNaN(Number(v))) as PowerUpType[]
    return types[Math.floor(Math.random() * types.length)]
  }
}
