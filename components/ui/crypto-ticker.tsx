"use client"

import { useState, useEffect } from "react"

interface CryptoPrice {
  symbol: string
  price: number
  change: number
}

export default function CryptoTicker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([
    { symbol: "BTC", price: 63842.51, change: 2.4 },
    { symbol: "ETH", price: 3456.78, change: -1.2 },
    { symbol: "XTZ", price: 1.23, change: 5.7 },
    { symbol: "SOL", price: 142.89, change: 3.1 },
    { symbol: "DOT", price: 7.82, change: -0.8 },
    { symbol: "AVAX", price: 35.67, change: 4.2 },
    { symbol: "LINK", price: 18.45, change: 1.9 },
    { symbol: "ADA", price: 0.45, change: -2.3 },
    { symbol: "MATIC", price: 0.67, change: 0.5 },
    { symbol: "UNI", price: 8.91, change: -1.7 },
  ])

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) =>
        prev.map((crypto) => ({
          ...crypto,
          price: Number.parseFloat((crypto.price * (1 + (Math.random() * 0.01 - 0.005))).toFixed(2)),
          change: Number.parseFloat((crypto.change + (Math.random() * 0.4 - 0.2)).toFixed(1)),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="crypto-ticker">
      <div className="ticker-content">
        {prices.map((crypto, index) => (
          <div key={index} className="ticker-item">
            <span className="font-bold mr-1">{crypto.symbol}</span>
            <span className="mr-1">${crypto.price.toLocaleString()}</span>
            <span className={crypto.change >= 0 ? "ticker-up" : "ticker-down"}>
              {crypto.change >= 0 ? "+" : ""}
              {crypto.change}%
            </span>
          </div>
        ))}
        {/* Duplicate items for seamless looping */}
        {prices.map((crypto, index) => (
          <div key={`dup-${index}`} className="ticker-item">
            <span className="font-bold mr-1">{crypto.symbol}</span>
            <span className="mr-1">${crypto.price.toLocaleString()}</span>
            <span className={crypto.change >= 0 ? "ticker-up" : "ticker-down"}>
              {crypto.change >= 0 ? "+" : ""}
              {crypto.change}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
