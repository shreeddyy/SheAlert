import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import type { SafetyPlan } from "@/lib/types"

const defaultChecklist = {
  emergencyContactsReady: false,
  locationSharingReady: false,
  audioEvidenceReady: false,
  safeRouteReviewed: false,
  emergencyBagReady: false,
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to view your safety plan." }, { status: 401 })
  }

  const db = await readDb()
  const safetyPlan =
    db.safetyPlans.find((item) => item.userId === user.id) ?? {
      id: crypto.randomUUID(),
      userId: user.id,
      safeWord: "",
      meetingPoint: "",
      medicalNotes: "",
      emergencyNote: "",
      checklist: defaultChecklist,
      updatedAt: new Date().toISOString(),
    }

  return NextResponse.json({ safetyPlan })
}

export async function PUT(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to update your safety plan." }, { status: 401 })
  }

  const body = await request.json()
  const db = await readDb()
  const current = db.safetyPlans.find((item) => item.userId === user.id)

  const safetyPlan: SafetyPlan = {
    id: current?.id ?? crypto.randomUUID(),
    userId: user.id,
    safeWord: String(body.safeWord ?? "").trim(),
    meetingPoint: String(body.meetingPoint ?? "").trim(),
    medicalNotes: String(body.medicalNotes ?? "").trim(),
    emergencyNote: String(body.emergencyNote ?? "").trim(),
    checklist: {
      emergencyContactsReady: Boolean(body.checklist?.emergencyContactsReady),
      locationSharingReady: Boolean(body.checklist?.locationSharingReady),
      audioEvidenceReady: Boolean(body.checklist?.audioEvidenceReady),
      safeRouteReviewed: Boolean(body.checklist?.safeRouteReviewed),
      emergencyBagReady: Boolean(body.checklist?.emergencyBagReady),
    },
    updatedAt: new Date().toISOString(),
  }

  await writeDb((state) => ({
    ...state,
    safetyPlans: current
      ? state.safetyPlans.map((item) => (item.userId === user.id ? safetyPlan : item))
      : [...state.safetyPlans, safetyPlan],
  }))

  return NextResponse.json({ safetyPlan })
}
