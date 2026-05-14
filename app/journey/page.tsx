'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock3, Route, Shield, CheckCircle2, XCircle } from 'lucide-react'

import { apiRequest } from '@/lib/api'

interface Contact {
  id: string
  name: string
  phone: string
}

interface Journey {
  id: string
  title: string
  destination: string
  transportMode: 'walking' | 'cab' | 'public-transport' | 'personal-vehicle'
  etaMinutes: number
  guardianContactIds: string[]
  guardianNames?: string[]
  notes: string
  status: 'active' | 'completed' | 'cancelled'
  startedAt: string
  completedAt?: string
  checkInDeadline: string
}

const transportOptions: Array<Journey['transportMode']> = ['walking', 'cab', 'public-transport', 'personal-vehicle']

export default function JourneyPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [journeys, setJourneys] = useState<Journey[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [form, setForm] = useState({
    title: '',
    destination: '',
    transportMode: 'walking' as Journey['transportMode'],
    etaMinutes: 30,
    guardianContactIds: [] as string[],
    notes: '',
  })

  useEffect(() => {
    async function loadJourneyData() {
      try {
        const data = await apiRequest<{ journeys: Journey[]; contacts: Contact[] }>('/api/journey', { method: 'GET' })
        setJourneys(data.journeys)
        setContacts(data.contacts)
      } catch (currentError) {
        setError(currentError instanceof Error ? currentError.message : 'Unable to load journey mode')
      } finally {
        setLoading(false)
      }
    }

    loadJourneyData()
  }, [])

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      () => undefined
    )
  }, [])

  const activeJourney = useMemo(
    () => journeys.find((journey) => journey.status === 'active'),
    [journeys]
  )

  const handleGuardianToggle = (contactId: string) => {
    setForm((current) => ({
      ...current,
      guardianContactIds: current.guardianContactIds.includes(contactId)
        ? current.guardianContactIds.filter((id) => id !== contactId)
        : [...current.guardianContactIds, contactId],
    }))
  }

  const handleStartJourney = async () => {
    setError('')
    setMessage('')

    try {
      const data = await apiRequest<{ journey: Journey }>('/api/journey', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          startLatitude: location?.latitude,
          startLongitude: location?.longitude,
        }),
      })

      const guardianNames = contacts
        .filter((contact) => data.journey.guardianContactIds.includes(contact.id))
        .map((contact) => contact.name)

      setJourneys([{ ...data.journey, guardianNames }, ...journeys])
      setMessage('Journey Mode activated successfully.')
      setForm({
        title: '',
        destination: '',
        transportMode: 'walking',
        etaMinutes: 30,
        guardianContactIds: [],
        notes: '',
      })
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to start journey')
    }
  }

  const handleStatusUpdate = async (journeyId: string, status: Journey['status']) => {
    setError('')
    setMessage('')

    try {
      const data = await apiRequest<{ journey: Journey }>(`/api/journey/${journeyId}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      })

      setJourneys((current) =>
        current.map((journey) =>
          journey.id === journeyId ? { ...journey, ...data.journey } : journey
        )
      )
      setMessage(status === 'completed' ? 'Journey marked safe and completed.' : 'Journey cancelled.')
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to update journey')
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Link href="/" className="fixed top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Journey Mode</h1>
          <p className="text-muted">
            Start a monitored trip with ETA, guardian selection, and check-in status tracking.
          </p>
        </div>

        {loading ? (
          <div className="card text-center py-12">
            <p className="text-muted">Loading journey workspace...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 card">
              <h2 className="text-2xl font-semibold mb-6">Start A Journey</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Journey Title</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="input-field"
                    placeholder="Late evening commute to hostel"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Destination</label>
                  <input
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    className="input-field"
                    placeholder="College hostel gate / home / metro station"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Transport Mode</label>
                  <select
                    value={form.transportMode}
                    onChange={(e) => setForm({ ...form, transportMode: e.target.value as Journey['transportMode'] })}
                    className="input-field"
                  >
                    {transportOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Expected Arrival (minutes)</label>
                  <input
                    type="number"
                    min={5}
                    value={form.etaMinutes}
                    onChange={(e) => setForm({ ...form, etaMinutes: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">Journey Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="input-field min-h-28"
                    placeholder="Cab details, route concerns, pickup details, clothing description, or anything useful"
                  />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Select Trusted Guardians</h3>
                {contacts.length === 0 ? (
                  <div className="rounded-xl border border-border p-4 text-sm text-muted">
                    No emergency contacts found yet. Add contacts first to use guardian-based journey tracking.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contacts.map((contact) => (
                      <label key={contact.id} className="flex items-center gap-3 p-3 rounded-xl bg-dark-tertiary cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.guardianContactIds.includes(contact.id)}
                          onChange={() => handleGuardianToggle(contact.id)}
                          className="w-4 h-4 rounded accent-brand"
                        />
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-xs text-muted">{contact.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {message && <p className="text-green-400 text-sm mt-5">{message}</p>}
              {error && <p className="text-alert text-sm mt-5">{error}</p>}

              <button onClick={handleStartJourney} className="btn-primary mt-6 inline-flex items-center gap-2">
                <Route className="w-4 h-4" />
                Start Journey Mode
              </button>
            </div>

            <div className="space-y-6">
              <div className="card border-brand-light border-2">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-brand" />
                  <h2 className="text-xl font-semibold">Active Journey</h2>
                </div>
                {activeJourney ? (
                  <div className="space-y-3">
                    <p className="font-semibold text-lg">{activeJourney.title}</p>
                    <p className="text-sm text-muted">Destination: {activeJourney.destination}</p>
                    <p className="text-sm text-muted">ETA: {activeJourney.etaMinutes} minutes</p>
                    <p className="text-sm text-muted">
                      Check-in deadline: {new Date(activeJourney.checkInDeadline).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted">
                      Guardians: {activeJourney.guardianNames?.join(', ') || 'None selected'}
                    </p>
                    <div className="flex gap-3 pt-3">
                      <button
                        onClick={() => handleStatusUpdate(activeJourney.id, 'completed')}
                        className="btn-primary inline-flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Mark Safe
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(activeJourney.id, 'cancelled')}
                        className="btn-secondary inline-flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted text-sm">No active journey right now.</p>
                )}
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <Clock3 className="w-5 h-5 text-brand" />
                  <h2 className="text-xl font-semibold">Why It Matters</h2>
                </div>
                <p className="text-sm text-muted leading-7">
                  Journey Mode makes the project much more major-project worthy because it combines travel planning,
                  ETA-based monitoring, trusted guardian selection, and post-journey safety confirmation in one workflow.
                </p>
              </div>
            </div>
          </div>
        )}

        {!loading && journeys.length > 0 && (
          <div className="card mt-8">
            <h2 className="text-2xl font-semibold mb-6">Journey History</h2>
            <div className="space-y-4">
              {journeys.map((journey) => (
                <div key={journey.id} className="border border-border rounded-xl p-4 bg-dark-tertiary/30">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-lg">{journey.title}</p>
                      <p className="text-sm text-muted mt-1">
                        {journey.destination} | {journey.transportMode} | {journey.etaMinutes} mins
                      </p>
                      <p className="text-xs text-muted mt-2">
                        Guardians: {journey.guardianNames?.join(', ') || 'None'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-sm font-semibold ${
                          journey.status === 'completed'
                            ? 'text-green-400'
                            : journey.status === 'cancelled'
                              ? 'text-yellow-400'
                              : 'text-brand'
                        }`}
                      >
                        {journey.status.toUpperCase()}
                      </p>
                      <p className="text-xs text-muted mt-1">
                        Started: {new Date(journey.startedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  {journey.notes && <p className="text-sm text-muted mt-3">{journey.notes}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
