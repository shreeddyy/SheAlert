import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"

type Context = {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, context: Context) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to update contacts." }, { status: 401 })
  }

  const { id } = await context.params
  const body = await request.json()
  const name = String(body.name ?? "").trim()
  const phone = String(body.phone ?? "").trim()
  const relation = String(body.relation ?? "").trim()

  if (!name || !phone) {
    return NextResponse.json({ error: "Name and phone are required." }, { status: 400 })
  }

  const db = await readDb()
  const current = db.contacts.find((contact) => contact.id === id && contact.userId === user.id)
  if (!current) {
    return NextResponse.json({ error: "Contact not found." }, { status: 404 })
  }

  const updated = { ...current, name, phone, relation: relation || undefined }

  await writeDb((state) => ({
    ...state,
    contacts: state.contacts.map((contact) => (contact.id === id ? updated : contact)),
  }))

  return NextResponse.json({ contact: updated })
}

export async function DELETE(request: NextRequest, context: Context) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to delete contacts." }, { status: 401 })
  }

  const { id } = await context.params
  await writeDb((db) => ({
    ...db,
    contacts: db.contacts.filter((contact) => !(contact.id === id && contact.userId === user.id)),
  }))

  return NextResponse.json({ success: true })
}
