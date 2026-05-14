'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, AlertCircle, Loader, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

import { apiRequest } from '@/lib/api'
import type { SafeLocation } from '@/lib/types'

export default function SafePathPage() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [mapLoading, setMapLoading] = useState(true)
  const [safeLocations, setSafeLocations] = useState<SafeLocation[]>([])
  const [selectedRoute, setSelectedRoute] = useState<SafeLocation | null>(null)
  const [expandedDirections, setExpandedDirections] = useState(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      setMapLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        setLocation(coords)

        try {
          const data = await apiRequest<{ safeLocations: SafeLocation[] }>(
            `/api/safe-path?latitude=${coords.latitude}&longitude=${coords.longitude}`,
            { method: 'GET' }
          )
          setSafeLocations(data.safeLocations)
        } finally {
          setMapLoading(false)
        }
      },
      () => {
        setMapLoading(false)
      }
    )
  }, [])

  const getMapUrl = () => {
    if (!location) return ''
    return `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.05},${location.latitude - 0.05},${location.longitude + 0.05},${location.latitude + 0.05}&layer=mapnik&marker=${location.latitude},${location.longitude}`
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Link href="/" className="fixed top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pt-24 flex flex-col flex-1">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Safe Path Assistant</h1>
          <p className="text-muted">View nearby safe locations and get step-by-step directions</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
          <div className="lg:col-span-2">
            <div className="card overflow-hidden h-96 lg:h-full bg-dark-secondary">
              {mapLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader className="w-6 h-6 text-brand animate-spin mx-auto mb-2" />
                    <p className="text-xs text-muted">Detecting your location...</p>
                  </div>
                </div>
              ) : !location ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center px-4">
                    <AlertCircle className="w-6 h-6 text-brand mx-auto mb-2" />
                    <p className="text-xs text-muted">Enable location access to view map</p>
                  </div>
                </div>
              ) : (
                <iframe
                  src={getMapUrl()}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="card flex-1 overflow-hidden flex flex-col">
              <h2 className="font-semibold mb-4 p-6 pb-0">Nearby Safe Locations</h2>
              <div className="space-y-2 overflow-y-auto flex-1 p-6 pt-2">
                {mapLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="w-5 h-5 animate-spin text-brand mr-2" />
                    <span className="text-muted text-sm">Loading...</span>
                  </div>
                ) : safeLocations.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <span className="text-muted text-sm">No locations found</span>
                  </div>
                ) : (
                  safeLocations.map((safeLocation) => (
                    <div key={safeLocation.id} className="space-y-2">
                      <button
                        onClick={() => {
                          setSelectedRoute(safeLocation)
                          setExpandedDirections(true)
                        }}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                          selectedRoute?.id === safeLocation.id
                            ? 'bg-brand-light border-brand shadow-md'
                            : 'border-border hover:border-brand-light hover:bg-dark-secondary'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                            safeLocation.type === 'police' ? 'bg-blue-500' :
                            safeLocation.type === 'hospital' ? 'bg-red-500' :
                            safeLocation.type === 'public' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm">{safeLocation.name}</p>
                            <p className="text-xs text-muted mt-1">
                              {safeLocation.type} | {safeLocation.distanceKm.toFixed(2)} km
                            </p>
                          </div>
                          {selectedRoute?.id === safeLocation.id && (
                            <CheckCircle className="w-5 h-5 text-brand flex-shrink-0" />
                          )}
                        </div>
                      </button>

                      {selectedRoute?.id === safeLocation.id && expandedDirections && (
                        <div className="bg-dark-secondary border-2 border-brand-light rounded-xl p-4 ml-2">
                          <button
                            onClick={() => setExpandedDirections(!expandedDirections)}
                            className="flex items-center justify-between w-full mb-3"
                          >
                            <h3 className="font-semibold text-sm">Step-by-Step Directions</h3>
                            {expandedDirections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <div className="space-y-2">
                            {safeLocation.directions.map((direction, idx) => (
                              <div key={idx} className="flex gap-2 items-start text-xs">
                                <div className="w-5 h-5 rounded-full bg-brand/20 border border-brand text-brand flex items-center justify-center text-xs font-bold flex-shrink-0">
                                  {idx + 1}
                                </div>
                                <p className="text-muted pt-0.5">{direction}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card bg-dark-secondary border-brand-light border-2">
              <div className="flex gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-brand flex-shrink-0" />
                <h3 className="font-semibold text-sm">Safety Tips</h3>
              </div>
              <ul className="space-y-2 text-xs text-muted">
                <li>Keep your phone charged</li>
                <li>Share your location with someone</li>
                <li>Stay on well-lit streets</li>
                <li>Walk with purpose</li>
                <li>Trust your instincts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
