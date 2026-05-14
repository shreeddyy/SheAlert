import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import { analyzeThreat } from "@/lib/server/threat-analysis"

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  const body = await request.json()
  const prompt = String(body.prompt ?? "").trim()

  if (!prompt) {
    return NextResponse.json({ error: "Please describe the situation first." }, { status: 400 })
  }

  const analysis = analyzeThreat(prompt, user?.id)

  await writeDb((db) => ({
    ...db,
    threatAnalyses: [...db.threatAnalyses, analysis],
  }))

  const db = await readDb()
  const recentAlerts = user ? db.sosAlerts.filter((alert) => alert.userId === user.id).length : 0

  return NextResponse.json({
    analysis,
    context: {
      recentAlerts,
    },
  })
}
