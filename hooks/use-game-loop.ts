"use client"

import { useRef, useEffect } from "react"
import { PHYSICS_TIME_STEP } from "@/utils/constants"

type UpdateFunction = (deltaTime: number) => void
type RenderFunction = () => void

export function useGameLoop(update: UpdateFunction, render: RenderFunction) {
  const requestRef = useRef<number>()
  const previousTimeRef = useRef<number>()
  const lagRef = useRef(0)

  const gameLoop = (time: number) => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time
    }

    const elapsed = time - previousTimeRef.current
    previousTimeRef.current = time
    lagRef.current += elapsed

    // Update game state in fixed time steps
    while (lagRef.current >= PHYSICS_TIME_STEP) {
      update(PHYSICS_TIME_STEP)
      lagRef.current -= PHYSICS_TIME_STEP
    }

    // Render at whatever frame rate the browser provides
    render()

    requestRef.current = requestAnimationFrame(gameLoop)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(gameLoop)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])
}
