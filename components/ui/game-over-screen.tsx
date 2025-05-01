"use client"

import { useGameContext } from "@/contexts/game-context"
import { getTimeUntilReset } from "@/utils/storage"
import { useState, useEffect } from "react"

export default function GameOverScreen() {
  const { gameState, setGameState, walletConnected, walletBalance, setWalletBalance, highScores, walletType } =
    useGameContext()

  const [timeUntilReset, setTimeUntilReset] = useState({ hours: 0, minutes: 0 })
  const [playerName, setPlayerName] = useState("")
  const [showNameInput, setShowNameInput] = useState(false)

  useEffect(() => {
    // Update the countdown every minute
    const updateCountdown = () => {
      setTimeUntilReset(getTimeUntilReset())
    }

    updateCountdown()
    const intervalId = setInterval(updateCountdown, 60000)

    return () => clearInterval(intervalId)
  }, [])

  // Check if current score is a high score
  const isHighScore =
    gameState.score > 0 && (highScores.length < 9 || gameState.score > highScores[highScores.length - 1].score)

  if (!gameState.gameOver) {
    return null
  }

  const gamesRemaining = gameState.dailyGamesLimit - gameState.gamesPlayedToday
  const canPlayAgain = gamesRemaining > 0

  const buyExtraLife = () => {
    if (walletBalance >= 0.01) {
      setWalletBalance((prev) => prev - 0.01)
      setGameState((prev) => ({
        ...prev,
        lives: prev.lives + 1,
        gameOver: false,
      }))
    }
  }

  const startNewGame = () => {
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

  const submitHighScore = () => {
    // In a real app, this would send the score to a server
    console.log(`Submitting high score: ${playerName} - ${gameState.score}`)
    setShowNameInput(false)
    startNewGame()
  }

  return (
    <div
      className={`absolute inset-0 bg-[#0F172A]/90 flex items-center justify-center z-20 transition-opacity duration-300 ${gameState.isOverlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-lg max-w-md w-full text-white border border-[#3B82F6]/20">
        <h2 className="text-4xl font-bold mb-6 text-center text-[#EF4444]">Game Over</h2>

        <div className="mb-8 text-center">
          <p className="text-2xl mb-2">
            Final Score: <span className="font-bold">{gameState.score}</span>
          </p>
          <p className="text-xl">
            High Score: <span className="font-bold">{gameState.highScore}</span>
          </p>
          <p className="text-lg mt-2">
            Level Reached: <span className="font-bold">{gameState.level}</span>
          </p>
        </div>

        {isHighScore && !showNameInput && (
          <div className="mb-6 p-4 bg-yellow-500 bg-opacity-20 rounded-lg text-center">
            <p className="text-yellow-300 font-bold mb-2">New High Score!</p>
            <button
              onClick={() => setShowNameInput(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
            >
              Save Your Score
            </button>
          </div>
        )}

        {showNameInput && (
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Enter Your Name:</label>
            <div className="flex">
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                maxLength={3}
                placeholder="AAA"
                className="bg-gray-700 text-white px-3 py-2 rounded-l w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={submitHighScore}
                disabled={!playerName}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r font-bold disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <span>Games Remaining Today:</span>
            <span className="font-bold">{gamesRemaining}</span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(gamesRemaining / gameState.dailyGamesLimit) * 100}%` }}
            ></div>
          </div>

          <p className="text-sm text-gray-400">
            Next reset in:{" "}
            <span className="font-mono">
              {timeUntilReset.hours}h {timeUntilReset.minutes}m
            </span>
          </p>
        </div>

        <div className="space-y-4">
          {walletConnected && (
            <button
              onClick={buyExtraLife}
              disabled={walletBalance < 0.01}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                walletBalance >= 0.01 ? "bg-[#10B981] hover:bg-[#059669]" : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Continue (0.01 {walletType})
            </button>
          )}

          <button
            onClick={startNewGame}
            disabled={!canPlayAgain}
            className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
              canPlayAgain ? "bg-[#3B82F6] hover:bg-[#2563EB]" : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            {canPlayAgain ? "Play Again" : "Daily Limit Reached"}
          </button>

          {!canPlayAgain && (
            <p className="text-center text-sm text-gray-400 mt-4">Come back tomorrow for more games!</p>
          )}
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => console.log("Share Result")}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold py-2 px-4 rounded"
          >
            Share Result
          </button>
          <button
            onClick={() => console.log("Try Mini-Sandbox")}
            className="bg-[#10B981] hover:bg-[#059669] text-white font-bold py-2 px-4 rounded ml-4"
          >
            Try Mini-Sandbox
          </button>
        </div>
      </div>
    </div>
  )
}
