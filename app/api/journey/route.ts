import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import type { Journey } from "@/lib/types"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to view journeys." }, { status: 401 })
  }

  const db = await readDb()
  const contacts = db.contacts.filter((item) => item.userId === user.id)
  const journeys = db.journeys
    .filter((item) => item.userId === user.id)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .map((journey) => ({
      ...journey,
      guardianNames: contacts
        .filter((contact) => journey.guardianContactIds.includes(contact.id))
        .map((contact) => contact.name),
    }))

  return NextResponse.json({ journeys, contacts })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to start Journey Mode." }, { status: 401 })
  }

  const body = await request.json()
  const title = String(body.title ?? "").trim()
  const destination = String(body.destination ?? "").trim()
  const etaMinutes = Number(body.etaMinutes ?? 0)
  const transportMode = String(body.transportMode ?? "")
  const guardianContactIds = Array.isArray(body.guardianContactIds) ? body.guardianContactIds.map(String) : []
  const notes = String(body.notes ?? "").trim()
  const startLatitude = typeof body.startLatitude === "number" ? body.startLatitude : undefined
  const startLongitude = typeof body.startLongitude === "number" ? body.startLongitude : undefined
  const destinationLatitude = typeof body.destinationLatitude === "number" ? body.destinationLatitude : undefined
  const destinationLongitude = typeof body.destinationLongitude === "number" ? body.destinationLongitude : undefined

  if (!title || !destination || !etaMinutes || !transportMode) {
    return NextResponse.json(
      { error: "Title, destination, transport mode, and ETA are required." },
      { status: 400 }
    )
  }

  const startedAt = new Date()
  const checkInDeadline = new Date(startedAt.getTime() + etaMinutes * 60 * 1000)

  const journey: Journey = {
    id: crypto.randomUUID(),
    userId: user.id,
    title,
    destination,
    transportMode: transportMode as Journey["transportMode"],
    etaMinutes,
    startLatitude,
    startLongitude,
    destinationLatitude,
    destinationLongitude,
    guardianContactIds,
    notes,
    status: "active",
    startedAt: startedAt.toISOString(),
    checkInDeadline: checkInDeadline.toISOString(),
  }

  await writeDb((db) => ({
    ...db,
    journeys: [journey, ...db.journeys],
  }))

  return NextResponse.json({ journey }, { status: 201 })
}
