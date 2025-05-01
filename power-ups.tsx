"use client"

// Define power-up types
export enum PowerUpType {
  MULTI_BALL = "MULTI_BALL",
  PADDLE_SIZE = "PADDLE_SIZE",
  SLOW_MOTION = "SLOW_MOTION",
  EXTRA_LIFE = "EXTRA_LIFE",
  SCORE_BOOST = "SCORE_BOOST",
}

// Interface for power-up objects
export interface PowerUp {
  x: number
  y: number
  dx: number
  dy: number
  type: PowerUpType
  size: number
  active: boolean
  duration: number
  startTime: number | null
  color: string
  icon: string
}

// Power-up colors and icons
export const POWER_UP_COLORS = {
  [PowerUpType.MULTI_BALL]: "#FF5555",
  [PowerUpType.PADDLE_SIZE]: "#55FF55",
  [PowerUpType.SLOW_MOTION]: "#5555FF",
  [PowerUpType.EXTRA_LIFE]: "#FF55FF",
  [PowerUpType.SCORE_BOOST]: "#FFFF55",
}

export const POWER_UP_ICONS = {
  [PowerUpType.MULTI_BALL]: "🔄",
  [PowerUpType.PADDLE_SIZE]: "📏",
  [PowerUpType.SLOW_MOTION]: "⏱️",
  [PowerUpType.EXTRA_LIFE]: "❤️",
  [PowerUpType.SCORE_BOOST]: "💎",
}

// Power-up durations in milliseconds
export const POWER_UP_DURATIONS = {
  [PowerUpType.MULTI_BALL]: 0, // Instant effect
  [PowerUpType.PADDLE_SIZE]: 10000, // 10 seconds
  [PowerUpType.SLOW_MOTION]: 8000, // 8 seconds
  [PowerUpType.EXTRA_LIFE]: 0, // Instant effect
  [PowerUpType.SCORE_BOOST]: 15000, // 15 seconds
}

// Create a new power-up
export function createPowerUp(x: number, y: number, scale: number): PowerUp {
  // Randomly select a power-up type
  const types = Object.values(PowerUpType)
  const randomType = types[Math.floor(Math.random() * types.length)]

  // Create power-up with random movement
  return {
    x,
    y,
    dx: (Math.random() - 0.5) * 2 * scale,
    dy: Math.random() * 2 * scale + 1 * scale, // Always fall downward but at varying speeds
    type: randomType,
    size: 20 * scale,
    active: false,
    duration: POWER_UP_DURATIONS[randomType],
    startTime: null,
    color: POWER_UP_COLORS[randomType],
    icon: POWER_UP_ICONS[randomType],
  }
}

// Update power-up position
export function updatePowerUp(powerUp: PowerUp, canvasWidth: number, canvasHeight: number): void {
  // Move the power-up
  powerUp.x += powerUp.dx
  powerUp.y += powerUp.dy

  // Bounce off walls
  if (powerUp.x < 0 || powerUp.x + powerUp.size > canvasWidth) {
    powerUp.dx = -powerUp.dx
  }

  // No bounce on top/bottom - power-ups should fall off the screen if not caught
}

// Draw a power-up
export function drawPowerUp(ctx: CanvasRenderingContext2D, powerUp: PowerUp): void {
  // Draw power-up background
  ctx.fillStyle = powerUp.color
  ctx.beginPath()
  ctx.arc(powerUp.x + powerUp.size / 2, powerUp.y + powerUp.size / 2, powerUp.size / 2, 0, Math.PI * 2)
  ctx.fill()

  // Draw power-up icon
  ctx.fillStyle = "#FFFFFF"
  ctx.font = `${powerUp.size * 0.7}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(powerUp.icon, powerUp.x + powerUp.size / 2, powerUp.y + powerUp.size / 2)
}

// Check if a power-up is active
export function isPowerUpActive(powerUp: PowerUp, currentTime: number): boolean {
  if (!powerUp.active || powerUp.startTime === null) return false

  // For instant power-ups, they're not considered "active" after application
  if (powerUp.duration === 0) return false

  return currentTime - powerUp.startTime < powerUp.duration
}

// Get remaining time for a power-up
export function getPowerUpRemainingTime(powerUp: PowerUp, currentTime: number): number {
  if (!powerUp.active || powerUp.startTime === null) return 0
  if (powerUp.duration === 0) return 0

  return Math.max(0, powerUp.duration - (currentTime - powerUp.startTime))
}
