"use client"

import { useEffect, useState } from "react"
import { PromptingIsAllYouNeed } from "./prompting"

// Interface for tracking daily game plays
interface GamePlayData {
  date: string
  plays: number
}

export default function GameManager() {
  const [gamesRemaining, setGamesRemaining] = useState(3)
  const [showGame, setShowGame] = useState(false)
  const [nextResetTime, setNextResetTime] = useState("")

  useEffect(() => {
    // Check localStorage for game play data
    const checkGamePlays = () => {
      const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format
      const storedData = localStorage.getItem("promptingGamePlays")

      let gamePlayData: GamePlayData

      if (storedData) {
        gamePlayData = JSON.parse(storedData)

        // If it's a new day, reset the counter
        if (gamePlayData.date !== today) {
          gamePlayData = { date: today, plays: 0 }
        }
      } else {
        gamePlayData = { date: today, plays: 0 }
      }

      // Calculate games remaining
      const remaining = Math.max(0, 3 - gamePlayData.plays)
      setGamesRemaining(remaining)

      // Calculate time until next reset
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const timeUntilReset = tomorrow.getTime() - new Date().getTime()
      const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
      const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))

      setNextResetTime(`${hours}h ${minutes}m`)

      // Save updated data
      localStorage.setItem("promptingGamePlays", JSON.stringify(gamePlayData))
    }

    checkGamePlays()

    // Update the countdown every minute
    const intervalId = setInterval(() => {
      checkGamePlays()
    }, 60000)

    return () => clearInterval(intervalId)
  }, [])

  const startGame = () => {
    if (gamesRemaining > 0) {
      // Decrement games remaining
      const today = new Date().toISOString().split("T")[0]
      const storedData = localStorage.getItem("promptingGamePlays")
      let gamePlayData: GamePlayData

      if (storedData) {
        gamePlayData = JSON.parse(storedData)
        if (gamePlayData.date === today) {
          gamePlayData.plays += 1
        } else {
          gamePlayData = { date: today, plays: 1 }
        }
      } else {
        gamePlayData = { date: today, plays: 1 }
      }

      localStorage.setItem("promptingGamePlays", JSON.stringify(gamePlayData))
      setGamesRemaining(Math.max(0, 3 - gamePlayData.plays))
      setShowGame(true)
    }
  }

  if (showGame) {
    return <PromptingIsAllYouNeed />
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Prompting Is All You Need</h1>

      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Daily Game Limit</h2>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Games Remaining Today:</span>
            <span className="font-bold text-xl">{gamesRemaining}</span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${(gamesRemaining / 3) * 100}%` }}></div>
          </div>
        </div>

        <div className="mb-6 text-sm text-gray-400">
          <p>
            Your daily game limit resets in: <span className="font-mono">{nextResetTime}</span>
          </p>
        </div>

        <button
          onClick={startGame}
          disabled={gamesRemaining === 0}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
            gamesRemaining > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          {gamesRemaining > 0 ? "Play Now" : "No Games Remaining Today"}
        </button>

        {gamesRemaining === 0 && (
          <p className="mt-4 text-center text-sm text-gray-400">Come back tomorrow for more games!</p>
        )}
      </div>

      <div className="mt-8 text-center max-w-md">
        <h3 className="text-xl font-semibold mb-2">How to Play</h3>
        <p className="text-gray-400">
          Control the paddles with your mouse to keep the ball in play. Break all the blocks to advance to the next
          level. Watch out for power-ups!
        </p>
      </div>
    </div>
  )
}
