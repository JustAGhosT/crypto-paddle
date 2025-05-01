"use client"

import { useState } from "react"
import GameContainer from "./game/game-container"

// Component to integrate the game into the website
export default function WebsiteIntegration() {
  const [showGame, setShowGame] = useState(true)
  const [stats] = useState({
    liquidityOptimized: "$2.5M+",
    tradingVolume: "$47.8M",
    activeStrategies: 183,
    averageAPY: "12.4%",
  })

  return (
    <div className="bg-[#0F172A] text-white min-h-screen flex flex-col">
      {/* Toggle Between Game and Rules */}
      <div className="flex justify-center pt-2 pb-1 border-b border-[#3B82F6]/20">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setShowGame(true)}
            className={`px-6 py-2 text-sm font-medium rounded-l-lg ${
              showGame ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-gray-300 hover:bg-[#2D3748] hover:text-white"
            }`}
          >
            Play Game
          </button>
          <button
            type="button"
            onClick={() => setShowGame(false)}
            className={`px-6 py-2 text-sm font-medium rounded-r-lg ${
              !showGame ? "bg-[#3B82F6] text-white" : "bg-[#1E293B] text-gray-300 hover:bg-[#2D3748] hover:text-white"
            }`}
          >
            Game Rules
          </button>
        </div>
      </div>

      {/* Content Area */}
      {showGame ? (
        <div className="flex-grow flex flex-col">
          <div className="flex-grow relative">
            <GameContainer />
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* High Scores Section */}
          <div className="bg-[#1E293B] rounded-lg p-6 border border-[#3B82F6]/20 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#61AEEE]">Top Traders Leaderboard</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-[#3B82F6]/20">
                    <th className="py-2 px-4">Rank</th>
                    <th className="py-2 px-4">Trader</th>
                    <th className="py-2 px-4">Score</th>
                    <th className="py-2 px-4">Level</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#3B82F6]/10">
                    <td className="py-2 px-4 text-[#F59E0B]">1</td>
                    <td className="py-2 px-4">TEZ</td>
                    <td className="py-2 px-4 font-mono">5000</td>
                    <td className="py-2 px-4">9</td>
                  </tr>
                  <tr className="border-b border-[#3B82F6]/10">
                    <td className="py-2 px-4 text-[#F59E0B]">2</td>
                    <td className="py-2 px-4">XTZ</td>
                    <td className="py-2 px-4 font-mono">4500</td>
                    <td className="py-2 px-4">8</td>
                  </tr>
                  <tr className="border-b border-[#3B82F6]/10">
                    <td className="py-2 px-4 text-[#F59E0B]">3</td>
                    <td className="py-2 px-4">NFT</td>
                    <td className="py-2 px-4 font-mono">4000</td>
                    <td className="py-2 px-4">7</td>
                  </tr>
                  <tr className="border-b border-[#3B82F6]/10">
                    <td className="py-2 px-4">4</td>
                    <td className="py-2 px-4">DFI</td>
                    <td className="py-2 px-4 font-mono">3500</td>
                    <td className="py-2 px-4">6</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">5</td>
                    <td className="py-2 px-4">LQD</td>
                    <td className="py-2 px-4 font-mono">3000</td>
                    <td className="py-2 px-4">5</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-400">
              <p>
                Compete with other traders to earn your place on the leaderboard. Higher scores represent better trading
                performance.
              </p>
            </div>
          </div>

          {/* Game Rules Section */}
          <div className="bg-[#1E293B] rounded-lg p-6 border border-[#3B82F6]/20 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-[#61AEEE]">How to Play</h2>
            <ul className="list-disc pl-5 space-y-3 text-gray-300">
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

          <h2 className="text-2xl font-bold mb-4 text-[#61AEEE]">Power-Up Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#1E293B] rounded-lg p-4 border border-[#3B82F6]/20 shadow-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-[#3B82F6] mr-2"></div>
                <span className="font-medium">Paddle Size+</span>
              </div>
              <p className="text-sm text-gray-400">Increases paddle size for better control</p>
            </div>
            <div className="bg-[#1E293B] rounded-lg p-4 border border-[#3B82F6]/20 shadow-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-[#EF4444] mr-2"></div>
                <span className="font-medium">Paddle Size-</span>
              </div>
              <p className="text-sm text-gray-400">Decreases paddle size, making control harder</p>
            </div>
            <div className="bg-[#1E293B] rounded-lg p-4 border border-[#3B82F6]/20 shadow-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-[#61AEEE] mr-2"></div>
                <span className="font-medium">Multi Ball</span>
              </div>
              <p className="text-sm text-gray-400">Adds extra balls to increase scoring potential</p>
            </div>
            <div className="bg-[#1E293B] rounded-lg p-4 border border-[#3B82F6]/20 shadow-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-[#10B981] mr-2"></div>
                <span className="font-medium">Extra Life</span>
              </div>
              <p className="text-sm text-gray-400">Gives you an additional life</p>
            </div>
            <div className="bg-[#1E293B] rounded-lg p-4 border border-[#3B82F6]/20 shadow-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-[#F59E0B] mr-2"></div>
                <span className="font-medium">Score Multiplier</span>
              </div>
              <p className="text-sm text-gray-400">Doubles your points for a limited time</p>
            </div>
            <div className="bg-[#1E293B] rounded-lg p-4 border border-[#3B82F6]/20 shadow-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-[#8B5CF6] mr-2"></div>
                <span className="font-medium">Slow Ball</span>
              </div>
              <p className="text-sm text-gray-400">Slows down all balls for easier control</p>
            </div>
            <div className="bg-[#1E293B] rounded-lg p-4 border border-[#3B82F6]/20 shadow-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-[#EC4899] mr-2"></div>
                <span className="font-medium">Fast Ball</span>
              </div>
              <p className="text-sm text-gray-400">Speeds up all balls for higher risk/reward</p>
            </div>
            <div className="bg-[#1E293B] rounded-lg p-4 border border-[#3B82F6]/20 shadow-lg">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 rounded-full bg-[#14B8A6] mr-2"></div>
                <span className="font-medium">Sticky Paddle</span>
              </div>
              <p className="text-sm text-gray-400">Balls stick to paddle for better control</p>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => setShowGame(true)}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-lg flex items-center"
            >
              Start Playing
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
