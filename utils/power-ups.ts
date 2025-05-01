import { type PowerUp, PowerUpType } from "@/types/game-types"
import { POWER_UP_COLORS, POWER_UP_SYMBOLS } from "@/utils/constants"

// Create a power-up with physics-based trajectory
export function createPowerUp(x: number, y: number, ballDx: number, ballDy: number, scale: number): PowerUp {
  // Get random power-up type
  const types = Object.values(PowerUpType).filter((v) => !isNaN(Number(v))) as PowerUpType[]
  const powerUpType = types[Math.floor(Math.random() * types.length)]

  // Calculate opposite direction from ball impact with some randomness
  const angle = Math.atan2(-ballDy, -ballDx) + ((Math.random() - 0.5) * Math.PI) / 4
  const speed = Math.sqrt(ballDx * ballDx + ballDy * ballDy) * 0.3

  return {
    x,
    y,
    dx: Math.cos(angle) * speed,
    dy: Math.sin(angle) * speed,
    type: powerUpType,
    size: 15 * scale,
    active: true,
    collected: false,
    rotation: 0,
    rotationSpeed: (Math.random() * 0.1 + 0.05) * (Math.random() > 0.5 ? 1 : -1),
  }
}

// Draw a power-up with enhanced visual effects
export function drawPowerUp(ctx: CanvasRenderingContext2D, powerUp: PowerUp): void {
  ctx.save()
  ctx.translate(powerUp.x, powerUp.y)
  ctx.rotate(powerUp.rotation)

  // Draw glow effect
  const time = Date.now() * 0.001
  const glowSize = 1 + 0.1 * Math.sin(time * 5)

  ctx.shadowBlur = 15
  ctx.shadowColor = POWER_UP_COLORS[powerUp.type]

  // Draw power-up background
  ctx.fillStyle = POWER_UP_COLORS[powerUp.type]
  ctx.beginPath()
  ctx.arc(0, 0, powerUp.size * glowSize, 0, Math.PI * 2)
  ctx.fill()

  // Draw power-up symbol
  ctx.shadowBlur = 0
  ctx.fillStyle = "#000000"
  ctx.font = `bold ${powerUp.size * 1.2}px Arial`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.fillText(POWER_UP_SYMBOLS[powerUp.type], 0, 0)

  ctx.restore()
}

// Update power-up position with enhanced physics
export function updatePowerUp(powerUp: PowerUp, canvasWidth: number, canvasHeight: number, gravity: number): void {
  // Apply gravity
  powerUp.dy += gravity

  // Apply drag (air resistance)
  powerUp.dx *= 0.99
  powerUp.dy *= 0.99

  // Move power-up
  powerUp.x += powerUp.dx
  powerUp.y += powerUp.dy

  // Rotate power-up
  powerUp.rotation += powerUp.rotationSpeed

  // Bounce off walls with energy loss
  if (powerUp.x - powerUp.size < 0) {
    powerUp.x = powerUp.size
    powerUp.dx = Math.abs(powerUp.dx) * 0.8
  } else if (powerUp.x + powerUp.size > canvasWidth) {
    powerUp.x = canvasWidth - powerUp.size
    powerUp.dx = -Math.abs(powerUp.dx) * 0.8
  }

  // Optional: Bounce off ceiling
  if (powerUp.y - powerUp.size < 0) {
    powerUp.y = powerUp.size
    powerUp.dy = Math.abs(powerUp.dy) * 0.8
  }
}
