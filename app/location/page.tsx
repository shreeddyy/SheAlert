'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, Shield, Loader, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'

import { apiRequest } from '@/lib/api'

interface Contact {
  id: string
  name: string
  phone: string
}

export default function LocationPage() {
  const [hasPermission, setHasPermission] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [newContact, setNewContact] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await apiRequest<{ contacts: Contact[] }>('/api/contacts', { method: 'GET' })
        setContacts(data.contacts)
      } catch {
        setContacts([])
      }
    }

    loadContacts()
  }, [])

  useEffect(() => {
    const detectLocation = () => {
      setLoading(true)
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser')
        setLoading(false)
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setHasPermission(true)
          setLoading(false)
        },
        (currentError) => {
          setError(`Location error: ${currentError.message}`)
          setLoading(false)
          setHasPermission(false)
        }
      )
    }

    detectLocation()
  }, [])

  const handleRequestPermission = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setHasPermission(true)
        setLoading(false)
        setError(null)
      },
      (currentError) => {
        setError(`Could not get location: ${currentError.message}`)
        setLoading(false)
      }
    )
  }

  const handleStartSharing = async () => {
    if (!location) return

    try {
      const nextState = !isSharing
      await apiRequest('/api/location/share', {
        method: 'POST',
        body: JSON.stringify({
          latitude: location.latitude,
          longitude: location.longitude,
          active: nextState,
          contactNames: contacts.map((contact) => contact.name),
        }),
      })
      setIsSharing(nextState)
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to update sharing status')
    }
  }

  const handleAddContact = async () => {
    if (!newContact.trim()) return

    try {
      const data = await apiRequest<{ contact: Contact }>('/api/contacts', {
        method: 'POST',
        body: JSON.stringify({
          name: newContact.trim(),
          phone: 'Not set',
          relation: 'Shared from location screen',
        }),
      })
      setContacts([...contacts, data.contact])
      setNewContact('')
      setShowAddForm(false)
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to add contact')
    }
  }

  const handleRemoveContact = async (id: string) => {
    try {
      await apiRequest(`/api/contacts/${id}`, {
        method: 'DELETE',
      })
      setContacts(contacts.filter((contact) => contact.id !== id))
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to remove contact')
    }
  }

  const getMapUrl = () => {
    if (!location) return null
    return `https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.01},${location.latitude - 0.01},${location.longitude + 0.01},${location.latitude + 0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`
  }

  return (
    <main className="min-h-screen bg-background">
      <Link href="/" className="fixed top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <h1 className="text-4xl font-bold mb-2">Live Location Sharing</h1>
        <p className="text-muted mb-12">Share your real-time location with emergency contacts</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {loading && (
              <div className="card h-96 lg:h-[500px] flex flex-col items-center justify-center">
                <Loader className="w-8 h-8 text-brand animate-spin mb-4" />
                <p className="text-muted">Detecting your location...</p>
              </div>
            )}

            {!hasPermission && !loading && (
              <div className="card h-96 lg:h-[500px] flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-dark-tertiary rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-brand" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-center">Enable Location Access</h2>
                <p className="text-muted text-center mb-6 max-w-sm">
                  We need your permission to access and share your location with emergency contacts
                </p>
                {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}
                <button onClick={handleRequestPermission} className="btn-primary">
                  Grant Permission
                </button>
              </div>
            )}

            {hasPermission && location && (
              <div className="space-y-4">
                <div className="card h-96 lg:h-[500px] p-0 overflow-hidden rounded-2xl">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={getMapUrl() || ''}
                    style={{ border: 0 }}
                  />
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Sharing Status</h3>
                    <div className={`w-3 h-3 rounded-full ${isSharing ? 'bg-green-500 animate-pulse' : 'bg-muted'}`} />
                  </div>
                  <p className={`text-lg font-medium ${isSharing ? 'text-green-400' : 'text-muted'}`}>
                    {isSharing ? `Broadcasting to ${contacts.length} Contact${contacts.length !== 1 ? 's' : ''}` : 'Not Sharing'}
                  </p>
                  <p className="text-xs text-muted mt-2 font-mono">
                    Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card">
              <h3 className="font-semibold mb-4">Live Sharing</h3>
              <button
                onClick={handleStartSharing}
                disabled={!hasPermission || contacts.length === 0}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ${
                  isSharing
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-dark-tertiary text-foreground hover:bg-border'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSharing ? 'Stop Sharing' : 'Start Live Sharing'}
              </button>
              {contacts.length === 0 && hasPermission && (
                <p className="text-xs text-muted mt-2 text-center">Add contacts to start sharing</p>
              )}
              {error && <p className="text-alert text-sm mt-3">{error}</p>}
            </div>

            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Sharing With</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
                  title="Add contact"
                >
                  <Plus className="w-5 h-5 text-brand" />
                </button>
              </div>

              {showAddForm && (
                <div className="mb-4 p-3 bg-dark-tertiary rounded-lg">
                  <input
                    type="text"
                    placeholder="Enter contact name..."
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddContact()}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm mb-2 focus:outline-none focus:border-brand"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAddContact}
                      className="flex-1 px-3 py-2 bg-brand text-white rounded-lg text-sm font-medium hover:bg-brand-light transition-colors"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 px-3 py-2 bg-dark-tertiary text-foreground rounded-lg text-sm font-medium hover:bg-border transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {contacts.length === 0 ? (
                  <p className="text-xs text-muted text-center py-4">No contacts added yet</p>
                ) : (
                  contacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-dark-tertiary rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold">{contact.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm truncate">{contact.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveContact(contact.id)}
                        className="p-1 hover:bg-background rounded transition-colors"
                        title="Remove contact"
                      >
                        <Trash2 className="w-4 h-4 text-red-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="card bg-dark-secondary border-brand-light border-2">
              <div className="flex gap-3">
                <Shield className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm mb-1">Your Privacy Matters</h4>
                  <p className="text-xs text-muted">Location sharing is now recorded through the backend so your safety sessions can persist beyond a single browser refresh.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
