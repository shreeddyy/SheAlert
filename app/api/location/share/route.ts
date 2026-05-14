import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import type { LocationShare } from "@/lib/types"

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  const body = await request.json()
  const latitude = Number(body.latitude)
  const longitude = Number(body.longitude)
  const active = Boolean(body.active)
  const contactNames = Array.isArray(body.contactNames) ? body.contactNames.map(String) : []

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: "Valid coordinates are required." }, { status: 400 })
  }

  const share: LocationShare = {
    id: crypto.randomUUID(),
    userId: user?.id,
    latitude,
    longitude,
    active,
    contactNames,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await writeDb((db) => ({
    ...db,
    locationShares: [...db.locationShares, share],
  }))

  const db = await readDb()
  const total = user ? db.locationShares.filter((entry) => entry.userId === user.id).length : db.locationShares.length

  return NextResponse.json({
    share,
    historyCount: total,
  })
}
