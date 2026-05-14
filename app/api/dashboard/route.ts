import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb } from "@/lib/server/db"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to view the dashboard." }, { status: 401 })
  }

  const db = await readDb()
  const contacts = db.contacts.filter((item) => item.userId === user.id)
  const sosAlerts = db.sosAlerts.filter((item) => item.userId === user.id)
  const locationShares = db.locationShares.filter((item) => item.userId === user.id)
  const threatAnalyses = db.threatAnalyses.filter((item) => item.userId === user.id)
  const audioRecords = db.audioRecords.filter((item) => item.userId === user.id)
  const safetyPlan = db.safetyPlans.find((item) => item.userId === user.id)
  const journeys = db.journeys.filter((item) => item.userId === user.id)

  const planChecks = safetyPlan ? Object.values(safetyPlan.checklist).filter(Boolean).length : 0
  const readinessScore = Math.min(
    100,
    contacts.length * 15 + planChecks * 10 + (audioRecords.length > 0 ? 10 : 0) + (journeys.length > 0 ? 10 : 0)
  )

  const recentActivity = [
    ...sosAlerts.map((item) => ({
      id: item.id,
      type: "SOS Alert",
      title: item.message,
      timestamp: item.createdAt,
    })),
    ...locationShares.map((item) => ({
      id: item.id,
      type: "Location Share",
      title: item.active ? "Live location sharing started" : "Live location sharing stopped",
      timestamp: item.updatedAt,
    })),
    ...threatAnalyses.map((item) => ({
      id: item.id,
      type: "Threat Analysis",
      title: `${item.threatLevel} risk analysis saved`,
      timestamp: item.createdAt,
    })),
    ...audioRecords.map((item) => ({
      id: item.id,
      type: "Audio Evidence",
      title: "Audio evidence recording stored",
      timestamp: item.createdAt,
    })),
    ...journeys.map((item) => ({
      id: item.id,
      type: "Journey Mode",
      title:
        item.status === "completed"
          ? `Journey completed: ${item.title}`
          : item.status === "cancelled"
            ? `Journey cancelled: ${item.title}`
            : `Journey started: ${item.title}`,
      timestamp: item.completedAt ?? item.startedAt,
    })),
  ]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 8)

  return NextResponse.json({
    stats: {
      contacts: contacts.length,
      sosAlerts: sosAlerts.length,
      locationShares: locationShares.length,
      threatAnalyses: threatAnalyses.length,
      audioRecords: audioRecords.length,
      journeys: journeys.length,
      activeJourneys: journeys.filter((item) => item.status === "active").length,
      readinessScore,
    },
    safetyPlan,
    recentActivity,
  })
}
