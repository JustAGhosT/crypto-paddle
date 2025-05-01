"use client"

import { useGameContext } from "@/contexts/game-context"

export default function GameVersion() {
  const { gameState } = useGameContext()

  return <div className="absolute top-2 right-2 text-white text-xs opacity-50">v{gameState.version}</div>
}
