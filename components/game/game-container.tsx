"use client"

import { useEffect } from "react"
import { GameProvider } from "@/contexts/game-context"
import GameCanvas from "./game-canvas"
import LandingPage from "../ui/landing-page"
import GameOverScreen from "../ui/game-over-screen"
import GameVersion from "../ui/game-version"
import CompetitionOverlay from "../ui/competition-overlay"
import HoverOverlay from "../ui/hover-overlay"
import FullscreenButton from "../ui/fullscreen-button"
import CryptoBackground from "../ui/crypto-background"
import CryptoTicker from "../ui/crypto-ticker"
import SignalHunt from "../ui/signal-hunt"
import VaultDefense from "../ui/vault-defense"
import StrategyDecision from "../ui/strategy-decision"
import BreakoutScene from '@/scenes/BreakoutScene';

export default function GameContainer() {
  // Initial setup on component mount
  useEffect(() => {
    // Prevent scrolling when arrow keys are pressed
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <GameProvider>
      <div className="relative flex flex-col h-screen w-full overflow-hidden game-container bg-[#0F172A]">
        <CryptoBackground />
        <GameCanvas />
        <HoverOverlay />
        <LandingPage />
        <GameOverScreen />
        <CryptoTicker />
        <GameVersion />
        <CompetitionOverlay />
        <FullscreenButton />
        <SignalHunt />
        <VaultDefense />
        <StrategyDecision />
      </div>
    </GameProvider>
  )
}
