import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import type { SOSAlert } from "@/lib/types"

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  const body = await request.json()
  const tapCount = Number(body.tapCount ?? 3)
  const message = String(body.message ?? "Emergency assistance requested").trim()
  const latitude = body.location?.latitude
  const longitude = body.location?.longitude

  const alert: SOSAlert = {
    id: crypto.randomUUID(),
    userId: user?.id,
    message,
    tapCount,
    location:
      typeof latitude === "number" && typeof longitude === "number"
        ? { latitude, longitude }
        : undefined,
    createdAt: new Date().toISOString(),
  }

  await writeDb((db) => ({
    ...db,
    sosAlerts: [...db.sosAlerts, alert],
  }))

  const db = await readDb()
  const contacts = user ? db.contacts.filter((contact) => contact.userId === user.id) : []

  return NextResponse.json({
    alert,
    notifiedContacts: contacts.map((contact) => contact.name),
    status: contacts.length > 0 ? "Broadcasting to emergency contacts" : "Emergency logged successfully",
  })
}
