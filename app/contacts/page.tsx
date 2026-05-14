'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2, Edit2, Plus } from 'lucide-react'
import Link from 'next/link'

import { apiRequest } from '@/lib/api'

interface Contact {
  id: string
  name: string
  phone: string
  relation?: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [formData, setFormData] = useState({ name: '', phone: '', relation: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [serverError, setServerError] = useState('')

  useEffect(() => {
    async function loadContacts() {
      try {
        const data = await apiRequest<{ contacts: Contact[] }>('/api/contacts', { method: 'GET' })
        setContacts(data.contacts)
      } catch (error) {
        setServerError(error instanceof Error ? error.message : 'Unable to load contacts')
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [])

  const handleAddContact = async () => {
    if (!formData.name || !formData.phone) {
      return
    }

    setServerError('')

    try {
      if (editingId) {
        const data = await apiRequest<{ contact: Contact }>(`/api/contacts/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        })
        setContacts(contacts.map((contact) => (contact.id === editingId ? data.contact : contact)))
        setEditingId(null)
      } else {
        const data = await apiRequest<{ contact: Contact }>('/api/contacts', {
          method: 'POST',
          body: JSON.stringify(formData),
        })
        setContacts([...contacts, data.contact])
      }

      setFormData({ name: '', phone: '', relation: '' })
      setShowForm(false)
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to save contact')
    }
  }

  const handleEditContact = (contact: Contact) => {
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relation: contact.relation ?? '',
    })
    setEditingId(contact.id)
    setShowForm(true)
  }

  const handleDeleteContact = async (id: string) => {
    try {
      await apiRequest<{ success: boolean }>(`/api/contacts/${id}`, {
        method: 'DELETE',
      })
      setContacts(contacts.filter((contact) => contact.id !== id))
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to delete contact')
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', phone: '', relation: '' })
    setEditingId(null)
    setShowForm(false)
    setServerError('')
  }

  return (
    <main className="min-h-screen bg-background">
      <Link href="/" className="fixed top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">Emergency Contacts</h1>
            <p className="text-muted mt-2">Manage your emergency contact list</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Contact
            </button>
          )}
        </div>

        {showForm && (
          <div className="card mb-8 border-2 border-brand-light">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Contact' : 'Add New Contact'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter contact name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Relation</label>
                <input
                  type="text"
                  placeholder="Mom, friend, roommate..."
                  value={formData.relation}
                  onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  className="input-field"
                />
              </div>
              {serverError && <p className="text-alert text-sm">{serverError}</p>}
              <div className="flex gap-3 pt-4">
                <button onClick={handleAddContact} className="btn-primary flex-1">
                  {editingId ? 'Update Contact' : 'Add Contact'}
                </button>
                <button onClick={handleCancel} className="btn-secondary flex-1">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {loading ? (
            <div className="card text-center py-12">
              <p className="text-muted">Loading saved contacts...</p>
            </div>
          ) : contacts.length === 0 && !showForm ? (
            <div className="card text-center py-12">
              <p className="text-muted mb-4">No emergency contacts added yet</p>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Contact
              </button>
            </div>
          ) : (
            contacts.map((contact) => (
              <div key={contact.id} className="card flex items-center justify-between group">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{contact.name}</h3>
                  <p className="text-muted font-mono text-sm">{contact.phone}</p>
                  {contact.relation && <p className="text-xs text-muted mt-2">{contact.relation}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditContact(contact)}
                    className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
                    title="Edit contact"
                  >
                    <Edit2 className="w-5 h-5 text-muted hover:text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2 hover:bg-dark-tertiary rounded-lg transition-colors"
                    title="Delete contact"
                  >
                    <Trash2 className="w-5 h-5 text-muted hover:text-alert" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {contacts.length > 0 && (
          <div className="mt-12 p-6 bg-dark-secondary border-2 border-brand-light rounded-2xl">
            <p className="text-muted mb-4">You have {contacts.length} emergency contact{contacts.length !== 1 ? 's' : ''} saved</p>
            <div className="btn-primary w-full text-center">Contacts saved to your safety profile</div>
          </div>
        )}
      </div>
    </main>
  )
}
