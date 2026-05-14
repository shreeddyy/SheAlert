import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import type { Contact } from "@/lib/types"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ contacts: [] }, { status: 200 })
  }

  const db = await readDb()
  return NextResponse.json({
    contacts: db.contacts.filter((contact) => contact.userId === user.id),
  })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to save contacts." }, { status: 401 })
  }

  const body = await request.json()
  const name = String(body.name ?? "").trim()
  const phone = String(body.phone ?? "").trim()
  const relation = String(body.relation ?? "").trim()

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 })
  }

  const contact: Contact = {
    id: crypto.randomUUID(),
    userId: user.id,
    name,
    phone,
    relation: relation || undefined,
    createdAt: new Date().toISOString(),
  }

  await writeDb((db) => ({
    ...db,
    contacts: [...db.contacts, contact],
  }))

  return NextResponse.json({ contact }, { status: 201 })
}
