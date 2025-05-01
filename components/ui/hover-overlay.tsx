"use client"

import { useEffect, useRef } from "react"
import { useGameContext } from "@/contexts/game-context"

export default function HoverOverlay() {
  const { gameState, setGameState } = useGameContext()
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle mouse hover events and title rotation
  useEffect(() => {
    // Function to handle mouse enter
    const handleMouseEnter = () => {
      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
        hoverTimeoutRef.current = null
      }

      // Show overlay immediately
      setGameState((prev) => ({ ...prev, isOverlayVisible: true }))
    }

    // Function to handle mouse leave
    const handleMouseLeave = () => {
      // Set a timeout to hide the overlay after a short delay
      // This prevents flickering when moving between elements
      hoverTimeoutRef.current = setTimeout(() => {
        setGameState((prev) => ({ ...prev, isOverlayVisible: false }))
      }, 300)
    }

    // Get the game container element
    const gameContainer = document.querySelector(".game-container")

    if (gameContainer) {
      gameContainer.addEventListener("mouseenter", handleMouseEnter)
      gameContainer.addEventListener("mouseleave", handleMouseLeave)
    }

    // Make sure overlay is hidden initially
    setGameState((prev) => ({ ...prev, isOverlayVisible: false }))

    return () => {
      if (gameContainer) {
        gameContainer.removeEventListener("mouseenter", handleMouseEnter)
        gameContainer.removeEventListener("mouseleave", handleMouseLeave)
      }

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [setGameState])

  // Set up title rotation when in resting state
  useEffect(() => {
    // Clear any existing interval
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current)
      rotationIntervalRef.current = null
    }

    // Only set up rotation if in resting state
    if (gameState.isRestingState) {
      rotationIntervalRef.current = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          titleRotation: (prev.titleRotation + 360) % 360, // Rotate 360 degrees
        }))
      }, 10000) // Every 10 seconds
    }

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current)
      }
    }
  }, [gameState.isRestingState, setGameState])

  // Update resting state based on game state
  useEffect(() => {
    const isResting = !gameState.gameStarted || gameState.gameOver || gameState.showLandingPage

    if (gameState.isRestingState !== isResting) {
      setGameState((prev) => ({ ...prev, isRestingState: isResting }))
    }
  }, [gameState.gameStarted, gameState.gameOver, gameState.showLandingPage, gameState.isRestingState, setGameState])

  return null // This component doesn't render anything, it just manages state
}
