// Power-up types
export enum PowerUpType {
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

export interface Pixel {
  x: number
  y: number
  size: number
  hit: boolean
  hasPowerUp: boolean
  powerUpType?: PowerUpType
}

export interface Ball {
  x: number
  y: number
  dx: number
  dy: number
  radius: number
  spin: number
  speedMultiplier: number
  isGhost?: boolean
}

export interface Paddle {
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

export interface PowerUp {
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

export interface PointLossIndicator {
  x: number
  y: number
  value: number
  alpha: number
  dy: number
}
