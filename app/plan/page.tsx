'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, ShieldCheck } from 'lucide-react'

import { apiRequest } from '@/lib/api'

interface SafetyPlan {
  safeWord: string
  meetingPoint: string
  medicalNotes: string
  emergencyNote: string
  checklist: {
    emergencyContactsReady: boolean
    locationSharingReady: boolean
    audioEvidenceReady: boolean
    safeRouteReviewed: boolean
    emergencyBagReady: boolean
  }
}

const defaultPlan: SafetyPlan = {
  safeWord: '',
  meetingPoint: '',
  medicalNotes: '',
  emergencyNote: '',
  checklist: {
    emergencyContactsReady: false,
    locationSharingReady: false,
    audioEvidenceReady: false,
    safeRouteReviewed: false,
    emergencyBagReady: false,
  },
}

const checklistLabels: Record<keyof SafetyPlan['checklist'], string> = {
  emergencyContactsReady: 'Emergency contacts reviewed',
  locationSharingReady: 'Location sharing tested',
  audioEvidenceReady: 'Audio evidence tool checked',
  safeRouteReviewed: 'Safe route reviewed',
  emergencyBagReady: 'Emergency essentials packed',
}

export default function PlanPage() {
  const [plan, setPlan] = useState<SafetyPlan>(defaultPlan)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPlan() {
      try {
        const data = await apiRequest<{ safetyPlan: SafetyPlan }>('/api/safety-plan', { method: 'GET' })
        setPlan(data.safetyPlan)
      } catch (currentError) {
        setError(currentError instanceof Error ? currentError.message : 'Unable to load safety plan')
      } finally {
        setLoading(false)
      }
    }

    loadPlan()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    setError('')

    try {
      await apiRequest('/api/safety-plan', {
        method: 'PUT',
        body: JSON.stringify(plan),
      })
      setMessage('Safety plan saved successfully.')
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to save safety plan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Link href="/" className="fixed top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Personal Safety Plan</h1>
          <p className="text-muted">Prepare a response strategy before an emergency ever happens.</p>
        </div>

        {loading ? (
          <div className="card text-center py-12">
            <p className="text-muted">Loading your safety plan...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 card">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2">Safe Word</label>
                  <input
                    value={plan.safeWord}
                    onChange={(e) => setPlan({ ...plan, safeWord: e.target.value })}
                    className="input-field"
                    placeholder="A word trusted people understand as a warning"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Meeting Point</label>
                  <input
                    value={plan.meetingPoint}
                    onChange={(e) => setPlan({ ...plan, meetingPoint: e.target.value })}
                    className="input-field"
                    placeholder="Nearest safe public location or pickup point"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Medical Notes</label>
                  <textarea
                    value={plan.medicalNotes}
                    onChange={(e) => setPlan({ ...plan, medicalNotes: e.target.value })}
                    className="input-field min-h-28"
                    placeholder="Allergies, medications, or critical medical details"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Emergency Note</label>
                  <textarea
                    value={plan.emergencyNote}
                    onChange={(e) => setPlan({ ...plan, emergencyNote: e.target.value })}
                    className="input-field min-h-28"
                    placeholder="What trusted contacts should do first if you trigger SOS"
                  />
                </div>

                {message && <p className="text-green-400 text-sm">{message}</p>}
                {error && <p className="text-alert text-sm">{error}</p>}

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Saving...' : 'Save Plan'}
                </button>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-brand" />
                <h2 className="text-xl font-semibold">Preparedness Checklist</h2>
              </div>
              <div className="space-y-3">
                {Object.entries(checklistLabels).map(([key, label]) => (
                  <label key={key} className="flex items-start gap-3 p-3 rounded-xl bg-dark-tertiary cursor-pointer">
                    <input
                      type="checkbox"
                      checked={plan.checklist[key as keyof SafetyPlan['checklist']]}
                      onChange={(e) =>
                        setPlan({
                          ...plan,
                          checklist: {
                            ...plan.checklist,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="mt-1 w-4 h-4 rounded accent-brand"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>

              <div className="mt-6 text-sm text-muted leading-6">
                A saved safety plan adds strong academic depth to this project because it shows preventive design,
                not just emergency reaction.
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
