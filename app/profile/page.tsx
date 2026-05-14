'use client'

import Link from 'next/link'
import { ArrowLeft, Shield, Phone, MapPin, Brain, Mic, ClipboardList, LayoutDashboard, Route } from 'lucide-react'

import { useAuth } from '@/hooks/use-auth'

const cards = [
  { title: 'Safety Dashboard', description: 'Track readiness score and recent safety activity.', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Safety Plan', description: 'Prepare your emergency checklist and safe-word plan.', href: '/plan', icon: ClipboardList },
  { title: 'Journey Mode', description: 'Plan trips with ETA, guardians, and check-in protection.', href: '/journey', icon: Route },
  { title: 'Emergency Contacts', description: 'Manage people you trust most.', href: '/contacts', icon: Phone },
  { title: 'Live Location', description: 'Share your route and status.', href: '/location', icon: MapPin },
  { title: 'Threat Analyzer', description: 'Assess personal safety in real time.', href: '/ai', icon: Brain },
  { title: 'Audio Vault', description: 'Capture and save supporting audio evidence.', href: '/audio', icon: Mic },
]

export default function ProfilePage() {
  const { user, loading } = useAuth()

  return (
    <main className="min-h-screen bg-background">
      <Link href="/" className="fixed top-20 left-4 sm:left-8 p-2 hover:bg-dark-tertiary rounded-lg transition-colors z-10">
        <ArrowLeft className="w-6 h-6" />
      </Link>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="card mb-8 border-2 border-brand-light">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted mb-2">Safety Profile</p>
              <h1 className="text-4xl font-bold mb-2">
                {loading ? 'Loading...' : user ? `Welcome, ${user.name}` : 'Guest Mode'}
              </h1>
              <p className="text-muted">
                {user
                  ? `Signed in as ${user.email}. Your safety tools are now connected to the backend.`
                  : 'Create an account to save contacts, recordings, incident history, and location sessions.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.title} href={card.href} className="card hover:scale-[1.01] transition-transform">
                <div className="w-12 h-12 rounded-xl bg-brand/15 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-brand" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
                <p className="text-muted">{card.description}</p>
              </Link>
            )
          })}
        </div>
      </div>
    </main>
  )
}
