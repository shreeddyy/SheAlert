import { NextResponse } from "next/server"

import { createSession, verifyPassword } from "@/lib/server/auth"
import { readDb } from "@/lib/server/db"

export async function POST(request: Request) {
  const body = await request.json()
  const email = String(body.email ?? "").trim().toLowerCase()
  const password = String(body.password ?? "")

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
  }

  const db = await readDb()
  const user = db.users.find((item) => item.email === email)
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
  }

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
