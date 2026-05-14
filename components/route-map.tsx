'use client'

import { useEffect, useRef } from 'react'

interface RouteMapProps {
  userLocation: { latitude: number; longitude: number }
  destination: { 
    name: string
    latitude: number
    longitude: number
    distance: number
  }
}

export default function RouteMap({ userLocation, destination }: RouteMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Calculate bounds and scaling
    const padding = 0.2
    const minLat = Math.min(userLocation.latitude, destination.latitude) - padding
    const maxLat = Math.max(userLocation.latitude, destination.latitude) + padding
    const minLon = Math.min(userLocation.longitude, destination.longitude) - padding
    const maxLon = Math.max(userLocation.longitude, destination.longitude) + padding

    const latRange = maxLat - minLat
    const lonRange = maxLon - minLon

    // Function to convert lat/lon to canvas coordinates
    const toCanvasX = (lon: number) => {
      return ((lon - minLon) / lonRange) * canvas.width
    }

    const toCanvasY = (lat: number) => {
      return ((maxLat - lat) / latRange) * canvas.height
    }

    // Get coordinates
    const userX = toCanvasX(userLocation.longitude)
    const userY = toCanvasY(userLocation.latitude)
    const destX = toCanvasX(destination.longitude)
    const destY = toCanvasY(destination.latitude)

    // Draw background
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#2a2a2a'
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw animated dashed route line
    ctx.strokeStyle = '#ff4d6d'
    ctx.lineWidth = 3
    ctx.setLineDash([8, 4])
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(userX, userY)
    ctx.lineTo(destX, destY)
    ctx.stroke()

    // Draw user location circle
    ctx.fillStyle = '#ff4d6d'
    ctx.beginPath()
    ctx.arc(userX, userY, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#ff8fab'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(userX, userY, 8, 0, Math.PI * 2)
    ctx.stroke()

    // Draw destination marker (pin icon)
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.moveTo(destX, destY - 12)
    ctx.arc(destX, destY - 12, 8, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#16a34a'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(destX, destY - 12, 8, 0, Math.PI * 2)
    ctx.stroke()

    // Draw pin bottom
    ctx.fillStyle = '#22c55e'
    ctx.beginPath()
    ctx.moveTo(destX - 6, destY - 5)
    ctx.lineTo(destX + 6, destY - 5)
    ctx.lineTo(destX, destY + 8)
    ctx.closePath()
    ctx.fill()

    // Draw labels
    ctx.fillStyle = '#ff4d6d'
    ctx.font = 'bold 12px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('You', userX, userY - 18)

    ctx.fillStyle = '#22c55e'
    ctx.fillText(destination.name, destX, destY - 30)

    // Draw distance info
    ctx.fillStyle = '#8b8b8b'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    const midX = (userX + destX) / 2
    const midY = (userY + destY) / 2
    ctx.fillText(`${destination.distance.toFixed(1)}km`, midX, midY - 10)

  }, [userLocation, destination])

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: '100%', height: '100%', display: 'block' }}
      className="bg-dark-secondary"
    />
  )
}
