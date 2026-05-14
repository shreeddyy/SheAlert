import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/navbar'

export const metadata: Metadata = {
  title: 'SheAlert - Your Personal Safety Companion',
  description: 'A women safety application with emergency alerts, location sharing, and AI threat analysis.',
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: '#ff4d6d',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" >
      <body className="antialiased bg-background text-foreground">
        <Navbar />
        {children}
      </body>
    </html>
  )
}
