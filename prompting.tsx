"use client"

import { useEffect, useRef, useState } from "react"

const COLOR = "#FFFFFF"
const HIT_COLOR = "#333333"
const BACKGROUND_COLOR = "#000000"
const BALL_COLOR = "#FFFFFF"
const PADDLE_COLOR = "#FFFFFF"
const LETTER_SPACING = 1
const WORD_SPACING = 3

// Expanded pixel map with Tezos, liquidity, vaults, AI related terms
const PIXEL_MAP = {
  P: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  R: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  M: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  I: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
  G: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0],
    [1, 0, 1, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  A: [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Y: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  U: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  D: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  Z: [
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 1],
  ],
  X: [
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  V: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  Q: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
  ],
  W: [
    [1, 0, 0, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
  ],
  H: [
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
  ],
  K: [
    [1, 0, 0, 1],
    [1, 0, 1, 0],
    [1, 1, 0, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ],
  B: [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
  ],
  F: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  J: [
    [0, 0, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 0],
  ],
}

// Power-up types
enum PowerUpType {
  PADDLE_SIZE_INCREASE = 0,
  PADDLE_SIZE_DECREASE = 1,
  MULTI_BALL = 2,
  EXTRA_LIFE = 3,
  SCORE_MULTIPLIER = 4,
  SLOW_BALL = 5,
  FAST_BALL = 6,
  STICKY_PADDLE = 7,
  GHOST_BALL = 8,
}

// Power-up colors
const POWER_UP_COLORS = {
  [PowerUpType.PADDLE_SIZE_INCREASE]: "#33FF33", // Green
  [PowerUpType.PADDLE_SIZE_DECREASE]: "#FF3333", // Red
  [PowerUpType.MULTI_BALL]: "#3333FF", // Blue
  [PowerUpType.EXTRA_LIFE]: "#FF33FF", // Pink
  [PowerUpType.SCORE_MULTIPLIER]: "#FFFF33", // Yellow
  [PowerUpType.SLOW_BALL]: "#33FFFF", // Cyan
  [PowerUpType.FAST_BALL]: "#FF9933", // Orange
  [PowerUpType.STICKY_PADDLE]: "#9933FF", // Purple
  [PowerUpType.GHOST_BALL]: "#FFFFFF", // White
}

// Power-up symbols
const POWER_UP_SYMBOLS = {
  [PowerUpType.PADDLE_SIZE_INCREASE]: "+",
  [PowerUpType.PADDLE_SIZE_DECREASE]: "-",
  [PowerUpType.MULTI_BALL]: "×",
  [PowerUpType.EXTRA_LIFE]: "♥",
  [PowerUpType.SCORE_MULTIPLIER]: "2×",
  [PowerUpType.SLOW_BALL]: "↓",
  [PowerUpType.FAST_BALL]: "↑",
  [PowerUpType.STICKY_PADDLE]: "≡",
  [PowerUpType.GHOST_BALL]: "○",
}

interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
  hasPowerUp: boolean
  powerUpType?: PowerUpType
}

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
  spin: number
  speedMultiplier: number
  isGhost?: boolean
}

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  targetY: number
  isVertical: boolean
  prevPosition: number
  velocity: number
  originalWidth?: number
  originalHeight?: number
  isSticky?: boolean
}

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

interface GameState {
  score: number
  highScore: number
  lives: number
  level: number
  gameOver: boolean
  gameStarted: boolean
  demoMode: boolean
  scoreMultiplier: number
  powerUpTimeRemaining: Record<PowerUpType, number>
  gamesPlayedToday: number
  dailyGamesLimit: number
  lastPlayDate: string
}

interface PointLossIndicator {
  x: number
  y: number
  value: number
  alpha: number
  dy: number
}

// Themes for different levels
const LEVEL_THEMES = [
  ["TEZOS", "BLOCKCHAIN"],
  ["SMART", "CONTRACTS"],
  ["LIQUIDITY", "POOLS"],
  ["DIGITAL", "VAULTS"],
  ["AI", "TRADING"],
  ["NFT", "MARKETPLACE"],
  ["DEFI", "STAKING"],
  ["CRYPTO", "WALLETS"],
  ["BAKING", "REWARDS"],
]

export function PromptingIsAllYouNeed() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixelsRef = useRef<Pixel[]>([])
  const ballsRef = useRef<Ball[]>([])
  const paddlesRef = useRef<Paddle[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const scaleRef = useRef(1)
  const gameStateRef = useRef<GameState>({
    score: 0,
    highScore: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    gameStarted: false,
    demoMode: true,
    scoreMultiplier: 1,
    powerUpTimeRemaining: {
      [PowerUpType.PADDLE_SIZE_INCREASE]: 0,
      [PowerUpType.PADDLE_SIZE_DECREASE]: 0,
      [PowerUpType.MULTI_BALL]: 0,
      [PowerUpType.SCORE_MULTIPLIER]: 0,
      [PowerUpType.SLOW_BALL]: 0,
      [PowerUpType.FAST_BALL]: 0,
      [PowerUpType.STICKY_PADDLE]: 0,
      [PowerUpType.GHOST_BALL]: 0,
    },
    gamesPlayedToday: 0,
    dailyGamesLimit: 3,
    lastPlayDate: "",
  })
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    gameStarted: false,
    demoMode: true,
    scoreMultiplier: 1,
    powerUpTimeRemaining: {
      [PowerUpType.PADDLE_SIZE_INCREASE]: 0,
      [PowerUpType.PADDLE_SIZE_DECREASE]: 0,
      [PowerUpType.MULTI_BALL]: 0,
      [PowerUpType.SCORE_MULTIPLIER]: 0,
      [PowerUpType.SLOW_BALL]: 0,
      [PowerUpType.FAST_BALL]: 0,
      [PowerUpType.STICKY_PADDLE]: 0,
      [PowerUpType.GHOST_BALL]: 0,
    },
    gamesPlayedToday: 0,
    dailyGamesLimit: 3,
    lastPlayDate: "",
  })
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  const mouseSpeedRef = useRef({ x: 0, y: 0 })
  const pointLossIndicatorsRef = useRef<PointLossIndicator[]>([])
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState(100) // Mock balance
  const [highScores, setHighScores] = useState<{ name: string; score: number }[]>([
    { name: "TEZ", score: 5000 },
    { name: "XTZ", score: 4500 },
    { name: "NFT", score: 4000 },
    { name: "DFI", score: 3500 },
    { name: "LQD", score: 3000 },
  ])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Load high score from localStorage
    const savedHighScore = localStorage.getItem("promptingGameHighScore")
    if (savedHighScore) {
      gameStateRef.current.highScore = Number.parseInt(savedHighScore)
      setGameState((prev) => ({ ...prev, highScore: Number.parseInt(savedHighScore) }))
    }

    // Load daily games played from localStorage
    const today = new Date().toDateString()
    const lastPlayDate = localStorage.getItem("promptingGameLastPlayDate")
    const gamesPlayedToday = localStorage.getItem("promptingGameGamesPlayedToday")

    if (lastPlayDate === today && gamesPlayedToday) {
      gameStateRef.current.gamesPlayedToday = Number.parseInt(gamesPlayedToday)
      gameStateRef.current.lastPlayDate = lastPlayDate
    } else {
      // Reset games played if it's a new day
      gameStateRef.current.gamesPlayedToday = 0
      gameStateRef.current.lastPlayDate = today
      localStorage.setItem("promptingGameLastPlayDate", today)
      localStorage.setItem("promptingGameGamesPlayedToday", "0")
    }

    setGameState((prev) => ({
      ...prev,
      gamesPlayedToday: gameStateRef.current.gamesPlayedToday,
      lastPlayDate: gameStateRef.current.lastPlayDate,
    }))

    // Mouse position tracking
    let mouseX = canvas.width / 2
    let mouseY = canvas.height / 2

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
      mouseX = newMouseX
      mouseY = newMouseY
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    const handleClick = () => {
      if (gameStateRef.current.gameOver) {
        // Check if daily game limit is reached
        if (gameStateRef.current.gamesPlayedToday >= gameStateRef.current.dailyGamesLimit) {
          // Cannot start a new game
          return
        }

        // Increment games played today
        gameStateRef.current.gamesPlayedToday++
        localStorage.setItem("promptingGameGamesPlayedToday", gameStateRef.current.gamesPlayedToday.toString())

        setGameState((prev) => ({
          ...prev,
          gamesPlayedToday: gameStateRef.current.gamesPlayedToday,
        }))

        initializeGame(true)
      } else if (!gameStateRef.current.gameStarted) {
        // Check if daily game limit is reached before starting
        if (gameStateRef.current.gamesPlayedToday >= gameStateRef.current.dailyGamesLimit) {
          // Cannot start a new game
          gameStateRef.current.gameOver = true
          setGameState((prev) => ({ ...prev, gameOver: true }))
          return
        }

        // Start the game when canvas is clicked
        gameStateRef.current.gameStarted = true
        gameStateRef.current.demoMode = false

        // Increment games played today when starting a new game
        gameStateRef.current.gamesPlayedToday++
        localStorage.setItem("promptingGameGamesPlayedToday", gameStateRef.current.gamesPlayedToday.toString())

        setGameState((prev) => ({
          ...prev,
          gameStarted: true,
          demoMode: false,
          gamesPlayedToday: gameStateRef.current.gamesPlayedToday,
        }))
      }
    }

    canvas.addEventListener("click", handleClick)

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight - 100 // Leave space for high score menu
      scaleRef.current = Math.min(canvas.width / 1000, canvas.height / 1000)
      initializeGame()
    }

    const getRandomPowerUpType = (): PowerUpType => {
      const types = Object.values(PowerUpType).filter((v) => !isNaN(Number(v))) as PowerUpType[]
      return types[Math.floor(Math.random() * types.length)]
    }

    const createPowerUp = (x: number, y: number, ballDx: number, ballDy: number): PowerUp => {
      const powerUpType = getRandomPowerUpType()
      return {
        x,
        y,
        dx: -ballDx * 0.3, // Move in opposite direction of ball impact
        dy: -ballDy * 0.3,
        type: powerUpType,
        size: 15 * scaleRef.current,
        active: true,
        collected: false,
        rotation: 0,
        rotationSpeed: (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
      }
    }

    const initializeGame = (resetLevel = false) => {
      const scale = scaleRef.current
      const LARGE_PIXEL_SIZE = 8 * scale
      const SMALL_PIXEL_SIZE = 4 * scale
      const BASE_BALL_SPEED = 5 * scale

      // Reset game state if needed
      if (resetLevel) {
        gameStateRef.current = {
          ...gameStateRef.current,
          score: 0,
          lives: 3,
          level: 1,
          gameOver: false,
          gameStarted: false,
          demoMode: true,
          scoreMultiplier: 1,
          powerUpTimeRemaining: {
            [PowerUpType.PADDLE_SIZE_INCREASE]: 0,
            [PowerUpType.PADDLE_SIZE_DECREASE]: 0,
            [PowerUpType.MULTI_BALL]: 0,
            [PowerUpType.SCORE_MULTIPLIER]: 0,
            [PowerUpType.SLOW_BALL]: 0,
            [PowerUpType.FAST_BALL]: 0,
            [PowerUpType.STICKY_PADDLE]: 0,
            [PowerUpType.GHOST_BALL]: 0,
          },
        }
        setGameState((prev) => ({
          ...prev,
          score: 0,
          lives: 3,
          level: 1,
          gameOver: false,
          gameStarted: false,
          demoMode: true,
          scoreMultiplier: 1,
        }))
      }

      // Get current level theme
      const levelIndex = (gameStateRef.current.level - 1) % LEVEL_THEMES.length
      const words = LEVEL_THEMES[levelIndex]

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
      const levelSpeedMultiplier = 1 + (gameStateRef.current.level - 1) * 0.1

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
          originalWidth: paddleWidth,
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

    const activatePowerUp = (type: PowerUpType) => {
      const POWER_UP_DURATION = 10000 // 10 seconds for most power-ups

      switch (type) {
        case PowerUpType.PADDLE_SIZE_INCREASE:
          // Increase paddle size by 50%
          paddlesRef.current.forEach((paddle) => {
            if (paddle.isVertical) {
              paddle.height = paddle.originalHeight! * 1.5
            } else {
              paddle.width = paddle.originalWidth! * 1.5
            }
          })
          gameStateRef.current.powerUpTimeRemaining[PowerUpType.PADDLE_SIZE_INCREASE] = POWER_UP_DURATION
          break

        case PowerUpType.PADDLE_SIZE_DECREASE:
          // Decrease paddle size by 30%
          paddlesRef.current.forEach((paddle) => {
            if (paddle.isVertical) {
              paddle.height = paddle.originalHeight! * 0.7
            } else {
              paddle.width = paddle.originalWidth! * 0.7
            }
          })
          gameStateRef.current.powerUpTimeRemaining[PowerUpType.PADDLE_SIZE_DECREASE] = POWER_UP_DURATION
          break

        case PowerUpType.MULTI_BALL:
          // Add two more balls
          const existingBalls = [...ballsRef.current]
          existingBalls.forEach((ball) => {
            // Create two new balls with slightly different angles
            for (let i = 0; i < 2; i++) {
              const angle = Math.random() * Math.PI * 2
              const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)

              ballsRef.current.push({
                x: ball.x,
                y: ball.y,
                dx: Math.cos(angle) * speed,
                dy: Math.sin(angle) * speed,
                radius: ball.radius,
                spin: 0,
                speedMultiplier: ball.speedMultiplier,
                isGhost: ball.isGhost,
              })
            }
          })
          gameStateRef.current.powerUpTimeRemaining[PowerUpType.MULTI_BALL] = POWER_UP_DURATION
          break

        case PowerUpType.EXTRA_LIFE:
          // Add an extra life
          gameStateRef.current.lives++
          setGameState((prev) => ({ ...prev, lives: prev.lives + 1 }))

          // Show indicator
          pointLossIndicatorsRef.current.push({
            x: canvas.width / 2,
            y: canvas.height / 2,
            value: -2, // Special value for extra life
            alpha: 1.0,
            dy: -1.5,
          })
          break

        case PowerUpType.SCORE_MULTIPLIER:
          // Double score for a limited time
          gameStateRef.current.scoreMultiplier = 2
          gameStateRef.current.powerUpTimeRemaining[PowerUpType.SCORE_MULTIPLIER] = POWER_UP_DURATION
          break

        case PowerUpType.SLOW_BALL:
          // Slow down all balls by 40%
          ballsRef.current.forEach((ball) => {
            ball.dx *= 0.6
            ball.dy *= 0.6
          })
          gameStateRef.current.powerUpTimeRemaining[PowerUpType.SLOW_BALL] = POWER_UP_DURATION
          break

        case PowerUpType.FAST_BALL:
          // Speed up all balls by 30%
          ballsRef.current.forEach((ball) => {
            ball.dx *= 1.3
            ball.dy *= 1.3
          })
          gameStateRef.current.powerUpTimeRemaining[PowerUpType.FAST_BALL] = POWER_UP_DURATION
          break

        case PowerUpType.STICKY_PADDLE:
          // Make paddles sticky
          paddlesRef.current.forEach((paddle) => {
            paddle.isSticky = true
          })
          gameStateRef.current.powerUpTimeRemaining[PowerUpType.STICKY_PADDLE] = POWER_UP_DURATION
          break

        case PowerUpType.GHOST_BALL:
          // Make balls pass through blocks
          ballsRef.current.forEach((ball) => {
            ball.isGhost = true
          })
          gameStateRef.current.powerUpTimeRemaining[PowerUpType.GHOST_BALL] = POWER_UP_DURATION
          break
      }

      // Update game state
      setGameState((prev) => ({
        ...prev,
        powerUpTimeRemaining: { ...gameStateRef.current.powerUpTimeRemaining },
        scoreMultiplier: gameStateRef.current.scoreMultiplier,
      }))
    }

    const deactivatePowerUp = (type: PowerUpType) => {
      switch (type) {
        case PowerUpType.PADDLE_SIZE_INCREASE:
          // Reset paddle size
          paddlesRef.current.forEach((paddle) => {
            if (paddle.isVertical) {
              paddle.height = paddle.originalHeight!
            } else {
              paddle.width = paddle.originalWidth!
            }
          })
          break

        case PowerUpType.PADDLE_SIZE_DECREASE:
          // Reset paddle size
          paddlesRef.current.forEach((paddle) => {
            if (paddle.isVertical) {
              paddle.height = paddle.originalHeight!
            } else {
              paddle.width = paddle.originalWidth!
            }
          })
          break

        case PowerUpType.SCORE_MULTIPLIER:
          // Reset score multiplier
          gameStateRef.current.scoreMultiplier = 1
          break

        case PowerUpType.STICKY_PADDLE:
          // Make paddles normal
          paddlesRef.current.forEach((paddle) => {
            paddle.isSticky = false
          })
          break

        case PowerUpType.GHOST_BALL:
          // Make balls normal
          ballsRef.current.forEach((ball) => {
            ball.isGhost = false
          })
          break
      }

      // Update game state
      setGameState((prev) => ({
        ...prev,
        powerUpTimeRemaining: { ...gameStateRef.current.powerUpTimeRemaining },
        scoreMultiplier: gameStateRef.current.scoreMultiplier,
      }))
    }

    const updateGame = () => {
      if (gameStateRef.current.gameOver) {
        return
      }

      // Update power-up timers
      Object.entries(gameStateRef.current.powerUpTimeRemaining).forEach(([typeStr, timeRemaining]) => {
        const type = Number(typeStr) as PowerUpType
        if (timeRemaining > 0) {
          gameStateRef.current.powerUpTimeRemaining[type] -= 16 // Assuming ~60fps

          if (gameStateRef.current.powerUpTimeRemaining[type] <= 0) {
            gameStateRef.current.powerUpTimeRemaining[type] = 0
            deactivatePowerUp(type)
          }
        }
      })

      // Update all balls
      ballsRef.current.forEach((ball, ballIndex) => {
        // Apply spin effect
        if (ball.spin !== 0) {
          if (Math.abs(ball.dx) > Math.abs(ball.dy)) {
            // Ball moving more horizontally, apply spin to vertical movement
            ball.dy += ball.spin * 0.02
            ball.spin *= 0.95 // Decay spin effect
          } else {
            // Ball moving more vertically, apply spin to horizontal movement
            ball.dx += ball.spin * 0.02
            ball.spin *= 0.95 // Decay spin effect
          }
        }

        // Move the ball
        ball.x += ball.dx
        ball.y += ball.dy

        // Ball collision with walls - with penalty
        if (ball.y - ball.radius < 0) {
          // Top wall hit without paddle
          let hitPaddle = false
          paddlesRef.current.forEach((paddle) => {
            if (!paddle.isVertical && paddle.y === 0 && ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
              hitPaddle = true
            }
          })

          if (!hitPaddle && gameStateRef.current.gameStarted && !gameStateRef.current.demoMode) {
            // Deduct more points for ceiling hit
            const pointsLost = 50
            gameStateRef.current.score = Math.max(0, gameStateRef.current.score - pointsLost)
            setGameState((prev) => ({ ...prev, score: Math.max(0, prev.score - pointsLost) }))

            // Add point loss indicator
            pointLossIndicatorsRef.current.push({
              x: ball.x,
              y: ball.y + 30,
              value: -pointsLost,
              alpha: 1.0,
              dy: -1,
            })
          }
          ball.dy = -ball.dy
        }

        if (ball.y + ball.radius > canvas.height) {
          // Bottom wall hit - lose a life if no paddle
          let hitPaddle = false
          paddlesRef.current.forEach((paddle) => {
            if (
              !paddle.isVertical &&
              paddle.y === canvas.height - paddle.height &&
              ball.x > paddle.x &&
              ball.x < paddle.x + paddle.width
            ) {
              hitPaddle = true
            }
          })

          if (!hitPaddle && gameStateRef.current.gameStarted && !gameStateRef.current.demoMode) {
            // Remove this ball
            ballsRef.current.splice(ballIndex, 1)

            // If no balls left, lose a life
            if (ballsRef.current.length === 0) {
              gameStateRef.current.lives--
              setGameState((prev) => ({ ...prev, lives: prev.lives - 1 }))

              // Add life loss indicator
              pointLossIndicatorsRef.current.push({
                x: ball.x,
                y: ball.y - 30,
                value: -1, // Special value for life loss
                alpha: 1.0,
                dy: -1,
              })

              if (gameStateRef.current.lives <= 0) {
                gameStateRef.current.gameOver = true
                setGameState((prev) => ({ ...prev, gameOver: true }))
                return
              }

              // Reset with a new ball
              const BASE_BALL_SPEED = 5 * scaleRef.current
              const levelSpeedMultiplier = 1 + (gameStateRef.current.level - 1) * 0.1

              ballsRef.current = [
                {
                  x: canvas.width * 0.5,
                  y: canvas.height * 0.5,
                  dx: BASE_BALL_SPEED * levelSpeedMultiplier * (Math.random() > 0.5 ? 1 : -1),
                  dy: -BASE_BALL_SPEED * levelSpeedMultiplier,
                  radius: ball.radius,
                  spin: 0,
                  speedMultiplier: levelSpeedMultiplier,
                  isGhost: false,
                },
              ]
            }
            return // Skip further processing for this ball
          } else {
            ball.dy = -ball.dy
          }
        }

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
          // Side wall hit without paddle
          let hitPaddle = false
          paddlesRef.current.forEach((paddle) => {
            if (
              paddle.isVertical &&
              ((paddle.x === 0 && ball.x - ball.radius < paddle.width) ||
                (paddle.x === canvas.width - paddle.width && ball.x + ball.radius > paddle.x)) &&
              ball.y > paddle.y &&
              ball.y < paddle.y + paddle.height
            ) {
              hitPaddle = true
            }
          })

          if (!hitPaddle && gameStateRef.current.gameStarted && !gameStateRef.current.demoMode) {
            // Deduct points for side wall hit
            const pointsLost = 25
            gameStateRef.current.score = Math.max(0, gameStateRef.current.score - pointsLost)
            setGameState((prev) => ({ ...prev, score: Math.max(0, prev.score - pointsLost) }))

            // Add point loss indicator
            pointLossIndicatorsRef.current.push({
              x: ball.x,
              y: ball.y - 30,
              value: -pointsLost,
              alpha: 1.0,
              dy: -1,
            })
          }
          ball.dx = -ball.dx
        }

        // Update point loss indicators
        pointLossIndicatorsRef.current.forEach((indicator, index) => {
          indicator.y += indicator.dy
          indicator.alpha -= 0.01
          if (indicator.alpha <= 0) {
            pointLossIndicatorsRef.current.splice(index, 1)
          }
        })

        // Update paddles based on mouse position or AI in demo mode
        paddlesRef.current.forEach((paddle, index) => {
          const prevPos = paddle.isVertical ? paddle.y : paddle.x

          if (gameStateRef.current.demoMode) {
            // AI control in demo mode
            if (paddle.isVertical) {
              // Vertical paddles follow ball Y position
              paddle.targetY = ball.y - paddle.height / 2
              paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
            } else {
              // Horizontal paddles follow ball X position
              paddle.targetY = ball.x - paddle.width / 2
              paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
            }
          } else {
            // Mouse control when game is started
            if (paddle.isVertical) {
              // Left and right paddles follow mouse Y position
              paddle.targetY = mouseY - paddle.height / 2
              paddle.targetY = Math.max(0, Math.min(canvas.height - paddle.height, paddle.targetY))
            } else {
              // Top and bottom paddles follow mouse X position
              paddle.targetY = mouseX - paddle.width / 2
              paddle.targetY = Math.max(0, Math.min(canvas.width - paddle.width, paddle.targetY))
            }
          }

          // Smooth paddle movement
          if (paddle.isVertical) {
            paddle.y += (paddle.targetY - paddle.y) * 0.2
          } else {
            paddle.x += (paddle.targetY - paddle.x) * 0.2
          }

          // Calculate paddle velocity for spin effect
          const currentPos = paddle.isVertical ? paddle.y : paddle.x
          paddle.velocity = currentPos - prevPos
          paddle.prevPosition = currentPos
        })

        // Paddle collision detection with angle change and spin
        paddlesRef.current.forEach((paddle) => {
          if (paddle.isVertical) {
            if (
              ball.x - ball.radius < paddle.x + paddle.width &&
              ball.x + ball.radius > paddle.x &&
              ball.y > paddle.y &&
              ball.y < paddle.y + paddle.height
            ) {
              // Calculate hit position relative to paddle center (0 = center, -1 = top edge, 1 = bottom edge)
              const hitPos = (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2)

              // Handle sticky paddle
              if (paddle.isSticky && Math.random() < 0.3) {
                // 30% chance to stick to paddle
                ball.dx = 0
                ball.dy = 0

                // Release after a short delay
                setTimeout(() => {
                  if (ballsRef.current.includes(ball)) {
                    // Reverse horizontal direction
                    ball.dx = Math.abs(ball.dx || 5 * scaleRef.current) * (paddle.x === 0 ? 1 : -1)

                    // Adjust angle based on hit position
                    ball.dy = hitPos * 2 * Math.abs(ball.dx) * 0.5
                  }
                }, 500)

                return
              }

              // Reverse horizontal direction
              ball.dx = -ball.dx

              // Adjust angle based on hit position
              ball.dy += hitPos * 2 * Math.abs(ball.dx) * 0.5

              // Add spin based on paddle movement
              ball.spin += paddle.velocity * 0.1

              // Normalize ball speed to prevent it from getting too slow or too fast
              const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)
              const baseSpeed = 5 * scaleRef.current * ball.speedMultiplier
              const normalizedSpeed = Math.max(baseSpeed * 0.8, Math.min(baseSpeed * 1.5, speed))
              const factor = normalizedSpeed / speed
              ball.dx *= factor
              ball.dy *= factor
            }
          } else {
            if (
              ball.y - ball.radius < paddle.y + paddle.height &&
              ball.y + ball.radius > paddle.y &&
              ball.x > paddle.x &&
              ball.x < paddle.x + paddle.width
            ) {
              // Calculate hit position relative to paddle center (0 = center, -1 = left edge, 1 = right edge)
              const hitPos = (ball.x - (paddle.x + paddle.width / 2)) / (paddle.width / 2)

              // Handle sticky paddle
              if (paddle.isSticky && Math.random() < 0.3) {
                // 30% chance to stick to paddle
                ball.dx = 0
                ball.dy = 0

                // Release after a short delay
                setTimeout(() => {
                  if (ballsRef.current.includes(ball)) {
                    // Reverse vertical direction
                    ball.dy = Math.abs(ball.dy || 5 * scaleRef.current) * (paddle.y === 0 ? 1 : -1)

                    // Adjust angle based on hit position
                    ball.dx = hitPos * 2 * Math.abs(ball.dy) * 0.5
                  }
                }, 500)

                return
              }

              // Reverse vertical direction
              ball.dy = -ball.dy

              // Adjust angle based on hit position
              ball.dx += hitPos * 2 * Math.abs(ball.dy) * 0.5

              // Add spin based on paddle movement
              ball.spin += paddle.velocity * 0.1

              // Normalize ball speed
              const speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy)
              const baseSpeed = 5 * scaleRef.current * ball.speedMultiplier
              const normalizedSpeed = Math.max(baseSpeed * 0.8, Math.min(baseSpeed * 1.5, speed))
              const factor = normalizedSpeed / speed
              ball.dx *= factor
              ball.dy *= factor
            }
          }
        })

        // Pixel collision detection and scoring
        pixelsRef.current.forEach((pixel, pixelIndex) => {
          if (
            !pixel.hit &&
            ball.x + ball.radius > pixel.x &&
            ball.x - ball.radius < pixel.x + pixel.size &&
            ball.y + ball.radius > pixel.y &&
            ball.y - ball.radius < pixel.y + pixel.size
          ) {
            // For ghost ball, just pass through and destroy
            if (!ball.isGhost) {
              const centerX = pixel.x + pixel.size / 2
              const centerY = pixel.y + pixel.size / 2
              if (Math.abs(ball.x - centerX) > Math.abs(ball.y - centerY)) {
                ball.dx = -ball.dx
              } else {
                ball.dy = -ball.dy
              }
            }

            pixel.hit = true

            // Only increment score when game is started and not in demo mode
            if (gameStateRef.current.gameStarted && !gameStateRef.current.demoMode) {
              // Increment score when a pixel is hit
              const pointsGained = 10 * gameStateRef.current.scoreMultiplier
              gameStateRef.current.score += pointsGained
              setGameState((prev) => ({ ...prev, score: prev.score + pointsGained }))

              // Update high score if needed
              if (gameStateRef.current.score > gameStateRef.current.highScore) {
                gameStateRef.current.highScore = gameStateRef.current.score
                setGameState((prev) => ({ ...prev, highScore: gameStateRef.current.score }))
                localStorage.setItem("promptingGameHighScore", gameStateRef.current.highScore.toString())
              }

              // Slightly increase ball speed with each hit
              ball.speedMultiplier *= 1.005

              // Create power-up if this pixel had one
              if (pixel.hasPowerUp && pixel.powerUpType !== undefined) {
                powerUpsRef.current.push(
                  createPowerUp(pixel.x + pixel.size / 2, pixel.y + pixel.size / 2, ball.dx, ball.dy),
                )
              }
            }
          }
        })
      })

      // Update power-ups
      powerUpsRef.current.forEach((powerUp, index) => {
        // Apply gravity
        powerUp.dy += 0.05 * scaleRef.current

        // Move power-up
        powerUp.x += powerUp.dx
        powerUp.y += powerUp.dy

        // Rotate power-up
        powerUp.rotation += powerUp.rotationSpeed

        // Bounce off walls
        if (powerUp.x - powerUp.size < 0 || powerUp.x + powerUp.size > canvas.width) {
          powerUp.dx = -powerUp.dx * 0.8
        }

        // Check if caught by paddle
        paddlesRef.current.forEach((paddle) => {
          if (
            powerUp.x + powerUp.size > paddle.x &&
            powerUp.x - powerUp.size < paddle.x + paddle.width &&
            powerUp.y + powerUp.size > paddle.y &&
            powerUp.y - powerUp.size < paddle.y + paddle.height &&
            !powerUp.collected
          ) {
            powerUp.collected = true

            // Add power-up indicator
            pointLossIndicatorsRef.current.push({
              x: powerUp.x,
              y: powerUp.y - 30,
              value: -3, // Special value for power-up
              alpha: 1.0,
              dy: -1.5,
            })

            // Activate power-up
            activatePowerUp(powerUp.type)
          }
        })

        // Remove if off-screen or collected
        if (powerUp.y > canvas.height + powerUp.size || powerUp.collected) {
          powerUpsRef.current.splice(index, 1)
        }
      })

      // Check if all pixels are hit
      const allHit = pixelsRef.current.every((pixel) => pixel.hit)
      if (
        allHit &&
        pixelsRef.current.length > 0 &&
        gameStateRef.current.gameStarted &&
        !gameStateRef.current.demoMode
      ) {
        // Level up
        gameStateRef.current.level++
        setGameState((prev) => ({ ...prev, level: prev.level + 1 }))

        // Bonus points for completing a level
        const levelBonus = 100 * gameStateRef.current.level
        gameStateRef.current.score += levelBonus
        setGameState((prev) => ({ ...prev, score: prev.score + levelBonus }))

        // Add bonus indicator
        pointLossIndicatorsRef.current.push({
          x: canvas.width / 2,
          y: canvas.height / 2,
          value: levelBonus, // Positive value for bonus
          alpha: 1.0,
          dy: -1.5,
        })

        // Update high score if needed
        if (gameStateRef.current.score > gameStateRef.current.highScore) {
          gameStateRef.current.highScore = gameStateRef.current.score
          setGameState((prev) => ({ ...prev, highScore: gameStateRef.current.score }))
          localStorage.setItem("promptingGameHighScore", gameStateRef.current.highScore.toString())
        }

        // Initialize next level
        initializeGame(false)
      }
    }

    const drawGame = () => {
      if (!ctx) return

      ctx.fillStyle = BACKGROUND_COLOR
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw pixels
      pixelsRef.current.forEach((pixel) => {
        ctx.fillStyle = pixel.hit ? HIT_COLOR : COLOR

        // Add subtle glow to power-up pixels
        if (!pixel.hit && pixel.hasPowerUp) {
          const time = Date.now() * 0.001
          const glow = 0.5 + 0.5 * Math.sin(time * 3)

          // Draw glow
          ctx.globalAlpha = 0.3 * glow
          ctx.beginPath()
          ctx.arc(pixel.x + pixel.size / 2, pixel.y + pixel.size / 2, pixel.size * 1.2, 0, Math.PI * 2)

          // Use power-up color for glow
          if (pixel.powerUpType !== undefined) {
            ctx.fillStyle = POWER_UP_COLORS[pixel.powerUpType]
          }

          ctx.fill()
          ctx.globalAlpha = 1.0
          ctx.fillStyle = COLOR
        }

        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      // Draw power-ups
      powerUpsRef.current.forEach((powerUp) => {
        ctx.save()
        ctx.translate(powerUp.x, powerUp.y)
        ctx.rotate(powerUp.rotation)

        // Draw power-up background
        ctx.fillStyle = POWER_UP_COLORS[powerUp.type]
        ctx.beginPath()
        ctx.arc(0, 0, powerUp.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw power-up symbol
        ctx.fillStyle = "#000000"
        ctx.font = `bold ${powerUp.size * 1.2}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(POWER_UP_SYMBOLS[powerUp.type], 0, 0)

        ctx.restore()
      })

      // Draw balls with trail effect
      ballsRef.current.forEach((ball) => {
        // Ball trail effect
        ctx.globalAlpha = 0.3
        for (let i = 1; i <= 3; i++) {
          const trailSize = ball.radius * (1 - i * 0.2)
          ctx.fillStyle = `rgba(255, 255, 255, ${0.7 - i * 0.2})`
          ctx.beginPath()
          ctx.arc(ball.x - ball.dx * i * 0.5, ball.y - ball.dy * i * 0.5, trailSize, 0, Math.PI * 2)
          ctx.fill()
        }

        // Main ball
        ctx.globalAlpha = ball.isGhost ? 0.6 : 1.0
        ctx.fillStyle = ball.isGhost ? "#AAAAFF" : BALL_COLOR
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      ctx.globalAlpha = 1.0

      // Draw paddles
      paddlesRef.current.forEach((paddle) => {
        // Draw sticky effect
        if (paddle.isSticky) {
          ctx.fillStyle = "rgba(255, 255, 100, 0.5)"
          if (paddle.isVertical) {
            ctx.fillRect(paddle.x - 2, paddle.y - 2, paddle.width + 4, paddle.height + 4)
          } else {
            ctx.fillRect(paddle.x - 2, paddle.y - 2, paddle.width + 4, paddle.height + 4)
          }
        }

        ctx.fillStyle = PADDLE_COLOR
        ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
      })

      // Draw point loss indicators
      pointLossIndicatorsRef.current.forEach((indicator) => {
        ctx.globalAlpha = indicator.alpha
        ctx.font = `bold ${Math.max(16, Math.floor(24 * scaleRef.current))}px Arial`

        if (indicator.value === -1) {
          // Life loss indicator
          ctx.fillStyle = "#FF3333"
          ctx.textAlign = "center"
          ctx.fillText("❤️ -1", indicator.x, indicator.y)
        } else if (indicator.value === -2) {
          // Extra life indicator
          ctx.fillStyle = "#33FF33"
          ctx.textAlign = "center"
          ctx.fillText("❤️ +1", indicator.x, indicator.y)
        } else if (indicator.value === -3) {
          // Power-up collected indicator
          ctx.fillStyle = "#FFFF33"
          ctx.textAlign = "center"
          ctx.fillText("POWER-UP!", indicator.x, indicator.y)
        } else if (indicator.value > 0) {
          // Bonus points
          ctx.fillStyle = "#33FF33"
          ctx.textAlign = "center"
          ctx.fillText(`+${indicator.value}`, indicator.x, indicator.y)
        } else {
          // Point loss
          ctx.fillStyle = "#FF3333"
          ctx.textAlign = "center"
          ctx.fillText(`${indicator.value}`, indicator.x, indicator.y)
        }
      })
      ctx.globalAlpha = 1.0

      // Draw score and game info
      const fontSize = Math.max(16, Math.floor(20 * scaleRef.current))
      ctx.font = `${fontSize}px Arial`
      ctx.fillStyle = COLOR
      ctx.textAlign = "left"
      ctx.fillText(`Score: ${gameStateRef.current.score}`, 20, 30)
      ctx.fillText(`High Score: ${gameStateRef.current.highScore}`, 20, 30 + fontSize + 5)
      ctx.fillText(`Lives: ${gameStateRef.current.lives}`, 20, 30 + (fontSize + 5) * 2)
      ctx.fillText(`Level: ${gameStateRef.current.level}`, 20, 30 + (fontSize + 5) * 3)

      // Draw games remaining
      ctx.textAlign = "right"
      ctx.fillText(
        `Games: ${gameStateRef.current.dailyGamesLimit - gameStateRef.current.gamesPlayedToday}/${gameStateRef.current.dailyGamesLimit} today`,
        canvas.width - 20,
        30,
      )

      // Draw active power-ups
      let powerUpY = 30 + fontSize + 5
      Object.entries(gameStateRef.current.powerUpTimeRemaining).forEach(([typeStr, timeRemaining]) => {
        if (timeRemaining > 0) {
          const type = Number(typeStr) as PowerUpType
          ctx.textAlign = "left"
          ctx.fillText(
            `${POWER_UP_SYMBOLS[type]} ${PowerUpType[type]}: ${(timeRemaining / 1000).toFixed(1)}s`,
            20,
            powerUpY,
          )
          powerUpY += fontSize + 5
        }
      })

      // Draw demo mode / click to start indicator
      if (!gameStateRef.current.gameStarted) {
        // Pulsating effect for the button
        const time = Date.now() * 0.001
        const pulse = 0.5 + 0.5 * Math.sin(time * 3)

        // Draw semi-transparent overlay
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + 0.2 * pulse})`
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Draw start button
        const buttonWidth = 200 * scaleRef.current
        const buttonHeight = 60 * scaleRef.current
        const buttonX = canvas.width / 2 - buttonWidth / 2
        const buttonY = canvas.height / 2 - buttonHeight / 2

        ctx.fillStyle = `rgba(50, 50, 50, ${0.7 + 0.3 * pulse})`
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight)

        ctx.strokeStyle = `rgba(255, 255, 255, ${0.7 + 0.3 * pulse})`
        ctx.lineWidth = 2
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight)

        ctx.font = `bold ${fontSize * 1.2}px Arial`
        ctx.fillStyle = `rgba(255, 255, 255, ${0.7 + 0.3 * pulse})`
        ctx.textAlign = "center"
        ctx.fillText("CLICK TO START", canvas.width / 2, canvas.height / 2 + fontSize * 0.4)

        ctx.font = `${fontSize * 0.8}px Arial`
        ctx.fillText("DEMO MODE", canvas.width / 2, canvas.height / 2 + fontSize * 1.5)
      }

      // Game over screen
      if (gameStateRef.current.gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        ctx.font = `${fontSize * 2}px Arial`
        ctx.fillStyle = COLOR
        ctx.textAlign = "center"
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - fontSize)

        ctx.font = `${fontSize}px Arial`
        ctx.fillText(`Final Score: ${gameStateRef.current.score}`, canvas.width / 2, canvas.height / 2 + fontSize)
        ctx.fillText(
          `High Score: ${gameStateRef.current.highScore}`,
          canvas.width / 2,
          canvas.height / 2 + fontSize * 2,
        )

        if (gameStateRef.current.gamesPlayedToday >= gameStateRef.current.dailyGamesLimit) {
          ctx.fillText("Daily game limit reached.", canvas.width / 2, canvas.height / 2 + fontSize * 4)
        } else {
          ctx.fillText("Click to play again", canvas.width / 2, canvas.height / 2 + fontSize * 4)
        }

        if (walletConnected) {
          ctx.fillText("Buy extra life: 10 XTZ", canvas.width / 2, canvas.height / 2 + fontSize * 6)
        }
      }
    }

    const gameLoop = () => {
      updateGame()
      drawGame()
      requestAnimationFrame(gameLoop)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)
    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("click", handleClick)
    }
  }, [walletConnected])

  const connectWallet = () => {
    // Mock wallet connection
    setWalletConnected(true)
  }

  const buyExtraLife = () => {
    if (walletBalance >= 10) {
      setWalletBalance((prev) => prev - 10)
      gameStateRef.current.lives += 1
      gameStateRef.current.gameOver = false
      setGameState((prev) => ({
        ...prev,
        lives: prev.lives + 1,
        gameOver: false,
      }))
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <canvas
        ref={canvasRef}
        className="flex-grow w-full"
        aria-label="Prompting Is All You Need: Fullscreen Pong game with pixel text"
      />

      {/* High Score Menu */}
      <div className="bg-gray-900 text-white p-4 h-24">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-1">High Scores</h2>
            <div className="flex space-x-8">
              {highScores.map((score, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-yellow-400 mr-2">{index + 1}.</span>
                  <span>
                    {score.name}: {score.score}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-4">
            {!walletConnected ? (
              <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
                Connect Wallet
              </button>
            ) : (
              <>
                <div className="text-right">
                  <div className="text-sm text-gray-300">Wallet Balance</div>
                  <div className="font-bold">{walletBalance} XTZ</div>
                </div>
                {gameStateRef.current.gameOver && (
                  <button
                    onClick={buyExtraLife}
                    disabled={walletBalance < 10}
                    className={`px-4 py-2 rounded ${
                      walletBalance >= 10 ? "bg-green-600 hover:bg-green-700" : "bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    Buy Extra Life (10 XTZ)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PromptingIsAllYouNeed
