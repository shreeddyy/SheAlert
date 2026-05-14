'use client'

import { useEffect, useState } from 'react'

import { apiRequest } from '@/lib/api'

interface SessionUser {
  id: string
  name: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      try {
        const data = await apiRequest<{ user: SessionUser | null }>('/api/auth/session', {
          method: 'GET',
        })
        if (mounted) {
          setUser(data.user)
        }
      } catch {
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSession()
    return () => {
      mounted = false
    }
  }, [])

  return { user, loading, setUser }
}
