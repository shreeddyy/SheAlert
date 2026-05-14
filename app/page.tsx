'use client'

import Link from 'next/link'
import { ShieldAlert, MapPin, Phone, Mic, Brain, LayoutDashboard, ClipboardList, Route } from 'lucide-react'

const cards = [
  {
    title: 'Share Live Location',
    description: 'Real-time location sharing with trusted contacts',
    icon: MapPin,
    href: '/location',
    color: 'from-brand-light to-brand'
  },
  {
    title: 'Record Audio',
    description: 'Secure audio recording for evidence',
    icon: Mic,
    href: '/audio',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Emergency Contacts',
    description: 'Manage your emergency contact list',
    icon: Phone,
    href: '/contacts',
    color: 'from-fuchsia-400 to-pink-500'
  },
  {
    title: 'Threat Analyzer',
    description: 'AI-inspired situation analysis with recommendations',
    icon: Brain,
    href: '/ai',
    color: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Safety Plan',
    description: 'Prepare a safe word, meeting point, and readiness checklist',
    icon: ClipboardList,
    href: '/plan',
    color: 'from-orange-400 to-amber-500'
  },
  {
    title: 'Journey Mode',
    description: 'Track a trip with ETA, guardians, and check-in status',
    icon: Route,
    href: '/journey',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    title: 'Dashboard & History',
    description: 'Track preparedness, alerts, and recent safety activity',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'from-indigo-500 to-sky-500'
  }
]

const features = [
  {
    title: 'Instant Response',
    description: 'Alert your emergency contacts with one tap'
  },
  {
    title: 'Preparedness First',
    description: 'Maintain a safety plan before an emergency happens'
  },
  {
    title: 'Smart Assistance',
    description: 'Threat analysis and safe-path guidance in one place'
  },
  {
    title: 'Journey Tracking',
    description: 'Monitor travel plans with ETA and guardian-aware check-ins'
  },
  {
    title: 'Activity Tracking',
    description: 'Review your evidence, alerts, and safety readiness history'
  }
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <section className="pt-14 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-[linear-gradient(135deg,rgba(255,255,255,0.88),rgba(255,231,240,0.94),rgba(240,248,255,0.84))] px-6 py-14 shadow-[0_30px_80px_rgba(232,93,117,0.16)] sm:px-10 lg:px-14">
          <div className="absolute -top-16 -left-12 h-44 w-44 rounded-full bg-brand-light/65 blur-3xl" />
          <div className="absolute top-10 right-8 h-36 w-36 rounded-full bg-sky-200/55 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-rose-200/80 blur-2xl" />
          <div className="absolute -bottom-8 right-1/4 h-32 w-32 rounded-full bg-amber-100/70 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-rose-100/60 to-transparent" />

          <div className="relative flex flex-col items-center justify-center text-center mb-16">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-light/70 bg-[linear-gradient(90deg,rgba(255,240,245,0.95),rgba(245,250,255,0.92))] px-4 py-2 text-sm font-medium text-brand-dark shadow-sm">
              <ShieldAlert className="h-4 w-4" />
              A personal safety and preparedness platform
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold mb-4 tracking-tight">
              <span className="text-brand">SheAlert</span>
            </h1>
            <p className="text-xl text-muted mb-8 max-w-3xl">
              A calm, supportive digital companion for safer travel, faster emergency action, and better preparedness in everyday life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                href="/sos"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-alert text-white rounded-2xl font-bold text-lg hover:bg-brand-dark transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                <ShieldAlert className="w-6 h-6" />
                SOS Emergency
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[linear-gradient(90deg,rgba(255,240,245,0.98),rgba(240,248,255,0.95))] text-foreground rounded-2xl font-bold text-lg hover:border-brand border border-border transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
              >
                <LayoutDashboard className="w-6 h-6 text-brand" />
                Safety Dashboard
              </Link>
            </div>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
            {cards.map((card, index) => {
              const Icon = card.icon
              return (
                <Link key={index} href={card.href}>
                  <div className="group card cursor-pointer h-full hover:-translate-y-1">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{card.title}</h3>
                    <p className="text-muted text-sm">{card.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[linear-gradient(180deg,rgba(253,235,242,0.94),rgba(255,243,247,0.88),rgba(239,248,255,0.72))] border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Why SheAlert?</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="rounded-2xl border border-border bg-[linear-gradient(180deg,rgba(255,255,255,0.9),rgba(252,231,239,0.82),rgba(240,248,255,0.75))] p-6 shadow-sm">
                <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
