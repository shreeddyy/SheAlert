import { NextResponse } from "next/server"

import { createSession, hashPassword } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import type { User } from "@/lib/types"

export async function POST(request: Request) {
  const body = await request.json()
  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim().toLowerCase()
  const password = String(body.password ?? "")

  if (!name || !email || password.length < 8) {
    return NextResponse.json(
      { error: "Name, email, and a password with at least 8 characters are required." },
      { status: 400 }
    )
  }

  const db = await readDb()
  const existing = db.users.find((user) => user.email === email)
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
  }

  const user: User = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  }

  await writeDb((current) => ({
    ...current,
    users: [...current.users, user],
  }))

  const token = await createSession(user.id)
  const response = NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
    token,
  })

  response.cookies.set("shealert_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  })

  return response
}
