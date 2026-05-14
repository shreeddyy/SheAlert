'use client'

import Link from 'next/link'
import { useState } from 'react'

import { useAuth } from '@/hooks/use-auth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, loading } = useAuth()

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-[linear-gradient(90deg,rgba(255,245,248,0.95),rgba(255,236,243,0.9),rgba(241,248,255,0.88))] shadow-sm backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-light rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">SA</span>
            </div>
            <span className="text-xl font-bold text-foreground hidden sm:inline">SheAlert</span>
          </Link>

          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-foreground hover:text-brand transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-brand transition-colors">
              Dashboard
            </Link>
            <Link href="/plan" className="text-foreground hover:text-brand transition-colors">
              Safety Plan
            </Link>
            <Link href="/journey" className="text-foreground hover:text-brand transition-colors">
              Journey
            </Link>
            <Link href="/profile" className="text-foreground hover:text-brand transition-colors">
              Profile
            </Link>
          </div>

          <div className="hidden sm:flex gap-3">
            {loading ? (
              <span className="text-sm text-muted">Loading...</span>
            ) : user ? (
              <>
                <Link href="/profile" className="btn-secondary text-sm">
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('shealert_token')
                    window.location.href = '/login'
                  }}
                  className="btn-primary text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-tertiary"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            <Link href="/" className="text-foreground hover:text-brand transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-foreground hover:text-brand transition-colors">
              Dashboard
            </Link>
            <Link href="/plan" className="text-foreground hover:text-brand transition-colors">
              Safety Plan
            </Link>
            <Link href="/journey" className="text-foreground hover:text-brand transition-colors">
              Journey
            </Link>
            <Link href="/profile" className="text-foreground hover:text-brand transition-colors">
              Profile
            </Link>
            {user ? (
              <>
                <Link href="/profile" className="btn-secondary text-sm w-full">
                  {user.name}
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('shealert_token')
                    window.location.href = '/login'
                  }}
                  className="btn-primary text-sm w-full"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn-secondary text-sm w-full">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm w-full">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
