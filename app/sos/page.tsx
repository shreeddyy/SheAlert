'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { apiRequest } from '@/lib/api'

export default function SOSPage() {
  const [tapCount, setTapCount] = useState(0)
  const [isActivated, setIsActivated] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (tapCount === 3) {
      const activate = async () => {
        let location: { latitude: number; longitude: number } | undefined

        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) =>
              navigator.geolocation.getCurrentPosition(resolve, reject)
            )
            location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }
          } catch {
            location = undefined
          }
        }

        try {
          const data = await apiRequest<{ status: string; notifiedContacts: string[] }>('/api/sos', {
            method: 'POST',
            body: JSON.stringify({
              tapCount: 3,
              message: 'Emergency assistance requested from SOS screen',
              location,
            }),
          })

          setStatus(
            data.notifiedContacts.length > 0
              ? `${data.status}: ${data.notifiedContacts.join(', ')}`
              : data.status
          )
        } catch (error) {
          setStatus(error instanceof Error ? error.message : 'Emergency activation failed')
        } finally {
          setIsActivated(true)
        }
      }

      activate()
    }

    const resetTimer = setTimeout(() => {
      if (tapCount > 0 && tapCount < 3) {
        setTapCount(0)
      }
    }, 2000)

    return () => clearTimeout(resetTimer)
  }, [tapCount])

  const handleSOSTap = () => {
    if (!isActivated) {
      setTapCount((prev) => prev + 1)
    }
  }

  const handleReset = () => {
    setTapCount(0)
    setIsActivated(false)
    setStatus('')
  }

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <Link href="/" className="absolute top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="flex flex-col items-center justify-center w-full max-w-md">
        {!isActivated ? (
          <>
            <h1 className="text-4xl font-bold mb-2 text-center">Emergency SOS</h1>
            <p className="text-muted text-center mb-12">Tap 3 times to confirm emergency</p>

            <button
              onClick={handleSOSTap}
              className="relative w-48 h-48 rounded-full font-bold text-white text-2xl transition-all duration-200 flex items-center justify-center bg-alert hover:bg-brand-dark active:scale-95 animate-pulse-alert"
              disabled={isActivated}
            >
              <span className="text-5xl font-black">SOS</span>
              {tapCount > 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-full h-full rounded-full border-4 border-white opacity-20 animate-ripple" />
                </div>
              )}
            </button>

            {tapCount > 0 && (
              <div className="mt-12 text-center">
                <p className="text-muted mb-2">Taps: {tapCount}/3</p>
                <div className="flex gap-2 justify-center">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i <= tapCount ? 'bg-brand' : 'bg-dark-tertiary'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center w-full">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h2 className="text-3xl font-bold mb-4">Emergency Activated!</h2>
            <p className="text-muted mb-8">The alert has been recorded on the backend and linked to your safety activity.</p>

            <div className="bg-dark-secondary border border-border rounded-2xl p-6 mb-8">
              <p className="text-sm text-muted mb-2">Status</p>
              <p className="text-lg font-semibold text-green-400">{status || 'Emergency logged successfully'}</p>
            </div>

            <button onClick={handleReset} className="btn-secondary w-full">
              Dismiss
            </button>
          </div>
        )}

        <div className="mt-16 text-center text-muted text-sm max-w-sm">
          <p>This distraction-free emergency interface now logs SOS activations through the backend so alerts can become part of your safety history.</p>
        </div>
      </div>
    </main>
  )
}
