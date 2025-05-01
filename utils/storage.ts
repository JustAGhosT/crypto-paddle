// Function to get high score from localStorage
export function getHighScore(): number {
  if (typeof window === "undefined") return 0

  const savedHighScore = localStorage.getItem("promptingGameHighScore")
  return savedHighScore ? Number.parseInt(savedHighScore, 10) : 0
}

// Function to save high score to localStorage
export function saveHighScore(score: number): void {
  if (typeof window === "undefined") return

  localStorage.setItem("promptingGameHighScore", score.toString())
}

// Function to get daily games played
export function getDailyGamesPlayed(): { gamesPlayed: number; lastPlayDate: string } {
  if (typeof window === "undefined") return { gamesPlayed: 0, lastPlayDate: "" }

  const today = new Date().toDateString()
  const lastPlayDate = localStorage.getItem("promptingGameLastPlayDate") || ""
  const gamesPlayedToday = localStorage.getItem("promptingGameGamesPlayedToday")

  // Reset counter if it's a new day
  if (lastPlayDate !== today) {
    localStorage.setItem("promptingGameLastPlayDate", today)
    localStorage.setItem("promptingGameGamesPlayedToday", "0")
    return { gamesPlayed: 0, lastPlayDate: today }
  }

  return {
    gamesPlayed: gamesPlayedToday ? Number.parseInt(gamesPlayedToday, 10) : 0,
    lastPlayDate,
  }
}

// Function to increment daily games played
export function incrementDailyGamesPlayed(): number {
  if (typeof window === "undefined") return 0

  const { gamesPlayed } = getDailyGamesPlayed()
  const newCount = gamesPlayed + 1
  localStorage.setItem("promptingGameGamesPlayedToday", newCount.toString())
  return newCount
}

// Function to get time until next day reset
export function getTimeUntilReset(): { hours: number; minutes: number } {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const timeUntilReset = tomorrow.getTime() - now.getTime()
  const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
  const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}
