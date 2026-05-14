'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Siren, Route, Brain, Mic, Phone, ClipboardList } from 'lucide-react'

import { apiRequest } from '@/lib/api'

interface DashboardData {
  stats: {
    contacts: number
    sosAlerts: number
    locationShares: number
    threatAnalyses: number
    audioRecords: number
    journeys: number
    activeJourneys: number
    readinessScore: number
  }
  safetyPlan?: {
    safeWord: string
    meetingPoint: string
    checklist: Record<string, boolean>
  }
  recentActivity: {
    id: string
    type: string
    title: string
    timestamp: string
  }[]
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await apiRequest<DashboardData>('/api/dashboard', { method: 'GET' })
        setData(response)
      } catch (currentError) {
        setError(currentError instanceof Error ? currentError.message : 'Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const cards = data ? [
    { title: 'Contacts', value: data.stats.contacts, icon: Phone, color: 'text-pink-400' },
    { title: 'SOS Alerts', value: data.stats.sosAlerts, icon: Siren, color: 'text-red-400' },
    { title: 'Location Sessions', value: data.stats.locationShares, icon: Route, color: 'text-cyan-400' },
    { title: 'Threat Analyses', value: data.stats.threatAnalyses, icon: Brain, color: 'text-green-400' },
    { title: 'Audio Records', value: data.stats.audioRecords, icon: Mic, color: 'text-yellow-400' },
    { title: 'Journeys', value: data.stats.journeys, icon: Route, color: 'text-teal-400' },
    { title: 'Readiness Score', value: `${data.stats.readinessScore}%`, icon: ShieldCheck, color: 'text-brand' },
  ] : []

  return (
    <main className="min-h-screen bg-background">
      <Link href="/" className="fixed top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Safety Dashboard</h1>
          <p className="text-muted">A consolidated view of your preparedness, history, and safety tool usage.</p>
        </div>

        {loading ? (
          <div className="card text-center py-12">
            <p className="text-muted">Loading dashboard...</p>
          </div>
        ) : error ? (
          <div className="card border-brand-light border-2">
            <p className="text-alert">{error}</p>
            <p className="text-muted mt-2">Sign in first to unlock your personal dashboard.</p>
          </div>
        ) : data ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {cards.map((card) => {
                const Icon = card.icon
                return (
                  <div key={card.title} className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm uppercase tracking-[0.2em] text-muted">{card.title}</h2>
                      <Icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-5 h-5 text-brand" />
                  <h2 className="text-xl font-semibold">Preparedness Snapshot</h2>
                </div>
                <div className="space-y-3 text-sm">
                  <p className="text-muted">
                    Safe Word: <span className="text-foreground">{data.safetyPlan?.safeWord || 'Not set'}</span>
                  </p>
                  <p className="text-muted">
                    Meeting Point: <span className="text-foreground">{data.safetyPlan?.meetingPoint || 'Not set'}</span>
                  </p>
                  <p className="text-muted">
                    Completed Checklist Items:{' '}
                    <span className="text-foreground">
                      {data.safetyPlan ? Object.values(data.safetyPlan.checklist).filter(Boolean).length : 0}/5
                    </span>
                  </p>
                  <p className="text-muted">
                    Active Journeys: <span className="text-foreground">{data.stats.activeJourneys}</span>
                  </p>
                </div>
                <Link href="/plan" className="btn-primary inline-flex mt-6">
                  Open Safety Plan
                </Link>
              </div>

              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Project Value</h2>
                <p className="text-muted leading-7">
                  This dashboard turns the app into a stronger major project by combining emergency response,
                  personal preparedness, journey tracking, history tracking, and evidence management into one connected system.
                </p>
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-6">Recent Safety Activity</h2>
              <div className="space-y-4">
                {data.recentActivity.length === 0 ? (
                  <p className="text-muted">No activity recorded yet. Start using the safety tools to build your project data trail.</p>
                ) : (
                  data.recentActivity.map((item) => (
                    <div key={item.id} className="border border-border rounded-xl p-4 bg-dark-tertiary/40">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold">{item.type}</p>
                          <p className="text-sm text-muted mt-1">{item.title}</p>
                        </div>
                        <p className="text-xs text-muted whitespace-nowrap">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
