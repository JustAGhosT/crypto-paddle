"use client"

import { useEffect, useState } from "react"
import { useGameContext } from "@/contexts/game-context"
import { getTimeUntilReset } from "@/utils/storage"

export default function LandingPage() {
  const { gameState, setGameState } = useGameContext()
  const [timeUntilReset, setTimeUntilReset] = useState({ hours: 0, minutes: 0 })

  useEffect(() => {
    // Update the countdown every minute
    const updateCountdown = () => {
      setTimeUntilReset(getTimeUntilReset())
    }

    updateCountdown()
    const intervalId = setInterval(updateCountdown, 60000)

    return () => clearInterval(intervalId)
  }, [])

  if (!gameState.showLandingPage) {
    return null
  }

  const gamesRemaining = gameState.dailyGamesLimit - gameState.gamesPlayedToday

  const startGame = (mode: "standard" | "pro") => {
    setGameState((prev) => ({
      ...prev,
      showLandingPage: false,
      gameMode: mode,
    }))
  }

  const handleProRunClick = () => {
    // Show sign-up modal for Pro Run
    setGameState((prev) => ({
      ...prev,
      showSignUpModal: true,
    }))
  }

  // Apply rotation to title when in resting state
  const titleStyle = gameState.isRestingState
    ? {
        transform: `rotate(${gameState.titleRotation}deg)`,
        transition: "transform 2s ease-in-out",
      }
    : {}

  return (
    <div
      className={`absolute inset-0 bg-[#0F172A]/90 flex items-center justify-center z-10 transition-opacity duration-300 ${gameState.isOverlayVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-[#1E293B] p-8 rounded-lg shadow-lg max-w-4xl w-full text-white border border-[#3B82F6]/20">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-bold text-center" style={titleStyle}>
            <span className="text-[#61AEEE]">AI-Powered</span> Liquidity Game
          </h1>
          <div className="text-sm text-gray-400">Version {gameState.version}</div>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Column 1: Game Info */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Daily Game Limit</h2>

            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span>Games Remaining Today:</span>
                <span className="font-bold text-xl">{gamesRemaining}</span>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${(gamesRemaining / gameState.dailyGamesLimit) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="text-sm text-gray-400 mb-6">
              <p>
                Your daily game limit resets in:{" "}
                <span className="font-mono">
                  {timeUntilReset.hours}h {timeUntilReset.minutes}m
                </span>
              </p>
            </div>

            <button
              onClick={() => startGame("standard")}
              disabled={gamesRemaining === 0}
              className={`w-full py-3 rounded-lg font-bold text-lg transition-colors ${
                gamesRemaining > 0 ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              {gamesRemaining > 0 ? "Start 90-Second Game" : "No Games Remaining Today"}
            </button>

            {gamesRemaining === 0 && (
              <p className="mt-4 text-center text-sm text-gray-400">Come back tomorrow for more games!</p>
            )}

            <button
              onClick={handleProRunClick}
              className="w-full py-3 mt-4 rounded-lg font-bold text-lg bg-green-600 hover:bg-green-700"
            >
              Start 5-Minute Pro Run
            </button>
          </div>

          {/* Column 2: How to Play */}
          <div>
            <h2 className="text-xl font-semibold mb-3">How to Play</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Control the paddles with your mouse to keep the ball in play</li>
              <li>Break all the blocks to advance to the next level</li>
              <li>
                <span className="text-yellow-400">Penalties:</span> Hitting walls costs 25 points, ceiling hits cost 50
                points!
              </li>
              <li>
                <span className="text-green-400">Power-ups:</span> Some blocks contain special power-ups that drop when
                hit
              </li>
              <li>Catch power-ups with your paddle to activate special abilities</li>
              <li>Avoid losing the ball at the bottom of the screen or you'll lose a life</li>
            </ul>
          </div>

          {/* Column 3: Power-Up Guide */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Power-Up Guide</h2>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span>Paddle Size+ (Increases paddle size)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span>Paddle Size- (Decreases paddle size)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>Multi Ball (Adds extra balls)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-pink-500 mr-2"></div>
                <span>Extra Life (Gives you an extra life)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
                <span>Score Multiplier (Doubles your points)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-cyan-500 mr-2"></div>
                <span>Slow Ball (Slows down all balls)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-orange-500 mr-2"></div>
                <span>Fast Ball (Speeds up all balls)</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                <span>Sticky Paddle (Balls stick to paddle)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">© 2023 Tezos Blockchain Game | All Rights Reserved</div>
      </div>
    </div>
  )
}
