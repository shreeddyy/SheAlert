import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import type { Journey } from "@/lib/types"

type Context = {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, context: Context) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to update journeys." }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json()
  const db = await readDb()
  const current = db.journeys.find((item) => item.id === id && item.userId === user.id)

  if (!current) {
    return NextResponse.json({ error: "Journey not found." }, { status: 404 })
  }

  const nextStatus =
    body.status === "completed" || body.status === "cancelled" || body.status === "active"
      ? (body.status as Journey["status"])
      : current.status

  const updated: Journey = {
    ...current,
    status: nextStatus,
    completedAt: nextStatus === "completed" ? new Date().toISOString() : current.completedAt,
  }

  await writeDb((state) => ({
    ...state,
    journeys: state.journeys.map((item) => (item.id === id ? updated : item)),
  }))

  return NextResponse.json({ journey: updated })
}
