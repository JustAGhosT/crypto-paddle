"use client"

import { useState, useEffect } from "react"
import { useGameContext } from "@/contexts/game-context"

interface Competition {
  id: string
  entryFee: number
  playersRequired: number
  playersJoined: number
  totalPot: number
  status: "open" | "filling" | "in-progress" | "completed"
  endsIn: number // seconds
  type: "standard" | "pro" | "team"
}

export default function CompetitionOverlay() {
  const { walletConnected, walletBalance, setWalletBalance } = useGameContext()
  const [showDetails, setShowDetails] = useState(false)
  const [selectedCompetition, setSelectedCompetition] = useState<Competition | null>(null)
  const [competitions, setCompetitions] = useState<Competition[]>([
    {
      id: "comp-1",
      entryFee: 0.01,
      playersRequired: 4,
      playersJoined: 2,
      totalPot: 0.02,
      status: "filling",
      endsIn: 3600, // 1 hour
      type: "standard",
    },
    {
      id: "comp-2",
      entryFee: 0.05,
      playersRequired: 8,
      playersJoined: 5,
      totalPot: 0.25,
      status: "filling",
      endsIn: 7200, // 2 hours
      type: "pro",
    },
    {
      id: "comp-3",
      entryFee: 0.1,
      playersRequired: 2,
      playersJoined: 1,
      totalPot: 0.1,
      status: "filling",
      endsIn: 1800, // 30 minutes
      type: "team",
    },
  ])

  // Update countdown timers
  useEffect(() => {
    const timer = setInterval(() => {
      setCompetitions((prevCompetitions) =>
        prevCompetitions.map((comp) => ({
          ...comp,
          endsIn: Math.max(0, comp.endsIn - 1),
        })),
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  const enterCompetition = (competition: Competition) => {
    if (!walletConnected) {
      alert("Please connect your wallet to enter competitions")
      return
    }

    if (walletBalance < competition.entryFee) {
      alert("Insufficient balance to enter this competition")
      return
    }

    // Update wallet balance
    setWalletBalance((prev) => prev - competition.entryFee)

    // Update competition state
    setCompetitions((prevCompetitions) =>
      prevCompetitions.map((comp) =>
        comp.id === competition.id
          ? {
              ...comp,
              playersJoined: comp.playersJoined + 1,
              totalPot: comp.totalPot + comp.entryFee,
              status: comp.playersJoined + 1 >= comp.playersRequired ? "in-progress" : "filling",
            }
          : comp,
      ),
    )

    // Show confirmation
    alert(`Successfully entered competition! Good luck!`)
    setShowDetails(false)
  }

  return (
    <div className="competition-overlay">
      <div className="competition-indicator" onClick={() => setShowDetails(!showDetails)}>
        <div className="competition-icon">🏆</div>
        <div className="competition-count">{competitions.filter((c) => c.status === "filling").length}</div>
      </div>

      {showDetails && (
        <div className="competition-details">
          <div className="competition-header">
            <h3>Available Competitions</h3>
            <button className="close-btn" onClick={() => setShowDetails(false)}>
              ×
            </button>
          </div>

          {selectedCompetition ? (
            <div className="competition-detail-view">
              <h4>Competition Details</h4>
              <div className="competition-info">
                <div className="info-row">
                  <span>Entry Fee:</span>
                  <span>{selectedCompetition.entryFee} ETH</span>
                </div>
                <div className="info-row">
                  <span>Total Pot:</span>
                  <span>{selectedCompetition.totalPot} ETH</span>
                </div>
                <div className="info-row">
                  <span>Players:</span>
                  <span>
                    {selectedCompetition.playersJoined}/{selectedCompetition.playersRequired}
                  </span>
                </div>
                <div className="info-row">
                  <span>Status:</span>
                  <span className={`status-${selectedCompetition.status}`}>{selectedCompetition.status}</span>
                </div>
                <div className="info-row">
                  <span>Ends in:</span>
                  <span>{formatTime(selectedCompetition.endsIn)}</span>
                </div>
                <div className="info-row">
                  <span>Type:</span>
                  <span>{selectedCompetition.type}</span>
                </div>
              </div>

              <div className="competition-actions">
                <button className="back-btn" onClick={() => setSelectedCompetition(null)}>
                  Back to List
                </button>
                <button
                  className="enter-btn"
                  disabled={!walletConnected || walletBalance < selectedCompetition.entryFee}
                  onClick={() => enterCompetition(selectedCompetition)}
                >
                  Enter Competition
                </button>
              </div>
            </div>
          ) : (
            <div className="competition-list">
              {competitions.map((competition) => (
                <div
                  key={competition.id}
                  className={`competition-item ${competition.status}`}
                  onClick={() => setSelectedCompetition(competition)}
                >
                  <div className="competition-item-header">
                    <span className="pot-amount">{competition.totalPot} ETH</span>
                    <span className="entry-fee">{competition.entryFee} ETH entry</span>
                  </div>
                  <div className="competition-item-body">
                    <div className="players-count">
                      <span className="players-joined">{competition.playersJoined}</span>/
                      <span className="players-required">{competition.playersRequired}</span> players
                    </div>
                    <div className="time-remaining">{formatTime(competition.endsIn)}</div>
                    <div className="competition-type">{competition.type}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
