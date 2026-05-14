'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Send, Loader, MapPin } from 'lucide-react'
import Link from 'next/link'

import { apiRequest } from '@/lib/api'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function AIThreatAnalyzerPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I am your AI threat analyzer. Describe any situation or concern and I will assess the likely risk level and suggest next safety steps.',
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [mapLoading, setMapLoading] = useState(true)

  useEffect(() => {
    if (!navigator.geolocation) {
      setMapLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setMapLoading(false)
      },
      () => {
        setMapLoading(false)
      }
    )
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const data = await apiRequest<{
        analysis: {
          threatLevel: 'LOW' | 'MEDIUM' | 'HIGH'
          observations: string[]
          recommendations: string[]
        }
        context: {
          recentAlerts: number
        }
      }>('/api/threat-analyzer', {
        method: 'POST',
        body: JSON.stringify({ prompt: userMessage.content }),
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Threat Level: ${data.analysis.threatLevel}\n\nKey Observations:\n- ${data.analysis.observations.join('\n- ')}\n\nRecommendations:\n1. ${data.analysis.recommendations.join('\n2. ')}\n\nRecent SOS alerts on your account: ${data.context.recentAlerts}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: error instanceof Error ? error.message : 'The threat analyzer is unavailable right now.',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getMapUrl = () => {
    if (!location) return null
    return `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.015},${location.latitude - 0.015},${location.longitude + 0.015},${location.latitude + 0.015}&layer=mapnik&marker=${location.latitude},${location.longitude}`
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Link href="/" className="fixed top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pt-24 flex flex-col flex-1">
        <h1 className="text-4xl font-bold mb-2">AI Threat Analyzer & Safe Path</h1>
        <p className="text-muted mb-8">Describe your situation and get AI-powered safety insights with real-time location</p>

        <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-[600px]">
          <div className="flex-1 flex flex-col">
            <div className="flex-1 card mb-6 overflow-y-auto">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.type === 'user'
                          ? 'bg-brand text-white rounded-br-none'
                          : 'bg-dark-tertiary text-foreground rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-2 ${message.type === 'user' ? 'text-pink-100' : 'text-muted'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-dark-tertiary text-foreground px-4 py-3 rounded-2xl rounded-bl-none flex gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Analyzing...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Describe the situation you're in..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
                className="input-field disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || isLoading}
                className="p-3 bg-brand text-white rounded-xl hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="lg:w-80 space-y-4 flex flex-col">
            {mapLoading ? (
              <div className="card p-0 overflow-hidden rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center">
                  <Loader className="w-6 h-6 text-brand animate-spin mx-auto mb-2" />
                  <p className="text-xs text-muted">Detecting location...</p>
                </div>
              </div>
            ) : location ? (
              <div className="card p-0 overflow-hidden rounded-2xl h-64">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  src={getMapUrl() || ''}
                  style={{ border: 0 }}
                />
              </div>
            ) : (
              <div className="card p-0 overflow-hidden rounded-2xl h-64 flex items-center justify-center">
                <div className="text-center px-4">
                  <MapPin className="w-6 h-6 text-brand mx-auto mb-2" />
                  <p className="text-xs text-muted">Enable location to see map</p>
                </div>
              </div>
            )}

            <div className="card flex-1">
              <h3 className="font-semibold mb-4">Quick Tools</h3>
              <div className="space-y-2">
                {[
                  'Someone is following me',
                  'I am in an unsafe location',
                  'A suspicious person is nearby',
                  'I feel uncomfortable walking alone',
                  'Help me make an emergency plan',
                ].map((tool, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(tool)}
                    className="w-full text-left px-3 py-2 hover:bg-dark-tertiary rounded-lg transition-colors text-sm text-muted hover:text-foreground"
                  >
                    {tool}
                  </button>
                ))}
              </div>
            </div>

            <div className="card bg-dark-secondary border-brand-light border-2">
              <h3 className="font-semibold mb-3 text-sm">Safety Tips</h3>
              <ul className="space-y-2 text-xs text-muted">
                <li>Trust your gut feeling</li>
                <li>Stay aware of surroundings</li>
                <li>Keep emergency contacts nearby</li>
                <li>Do not isolate yourself</li>
                <li>Share your location</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
