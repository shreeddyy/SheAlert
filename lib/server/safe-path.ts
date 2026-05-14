import type { SafeLocation } from "@/lib/types"

const baseLocations = [
  { name: "Police Station", type: "police" as const, latOffset: 0.005, lonOffset: 0.004 },
  { name: "Hospital", type: "hospital" as const, latOffset: -0.006, lonOffset: 0.003 },
  { name: "Shopping Mall", type: "public" as const, latOffset: 0.008, lonOffset: -0.005 },
  { name: "Women's Shelter", type: "shelter" as const, latOffset: -0.004, lonOffset: -0.006 },
  { name: "Fire Station", type: "police" as const, latOffset: 0.003, lonOffset: -0.007 },
]

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radiusKm = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return radiusKm * c
}

export function generateDirections(
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number,
  destination: string
) {
  const latDiff = endLat - startLat
  const lonDiff = endLon - startLon
  const distance = calculateDistance(startLat, startLon, endLat, endLon)
  const directions: string[] = []

  if (Math.abs(latDiff) > Math.abs(lonDiff)) {
    directions.push(latDiff > 0 ? "Head North" : "Head South")
    if (lonDiff > 0.001) directions.push("Slightly Northeast")
    if (lonDiff < -0.001) directions.push("Slightly Northwest")
  } else {
    directions.push(lonDiff > 0 ? "Head East" : "Head West")
    if (latDiff > 0.001) directions.push("Slightly North")
    if (latDiff < -0.001) directions.push("Slightly South")
  }

  directions.push(`Walk for approximately ${(distance * 1.2).toFixed(1)} km`)
  directions.push("Prefer crowded, well-lit roads")
  directions.push(`Arrive at ${destination}`)
  directions.push("Alert local authorities if the situation escalates")

  return directions
}

export function getSafeLocations(latitude: number, longitude: number): SafeLocation[] {
  return baseLocations.map((location, index) => {
    const itemLat = latitude + location.latOffset
    const itemLon = longitude + location.lonOffset
    const distanceKm = calculateDistance(latitude, longitude, itemLat, itemLon)

    return {
      id: String(index + 1),
      name: location.name,
      type: location.type,
      latitude: itemLat,
      longitude: itemLon,
      distanceKm,
      directions: generateDirections(latitude, longitude, itemLat, itemLon, location.name),
    }
  })
}
