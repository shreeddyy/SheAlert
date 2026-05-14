import { createHash, randomBytes, timingSafeEqual } from "crypto"
import { NextRequest } from "next/server"

import { readDb, writeDb } from "@/lib/server/db"
import type { Session, User } from "@/lib/types"

function hashValue(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

export function hashPassword(password: string) {
  return hashValue(password)
}

export function verifyPassword(password: string, passwordHash: string) {
  const incoming = Buffer.from(hashValue(password))
  const stored = Buffer.from(passwordHash)
  if (incoming.length !== stored.length) {
    return false
  }
  return timingSafeEqual(incoming, stored)
}

export async function createSession(userId: string) {
  const token = randomBytes(24).toString("hex")
  const session: Session = {
    token,
    userId,
    createdAt: new Date().toISOString(),
  }

  await writeDb((db) => ({
    ...db,
    sessions: [...db.sessions.filter((item) => item.userId !== userId), session],
  }))

  return token
}

export async function getSessionToken(request: NextRequest) {
  const header = request.headers.get("authorization")
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length)
  }

  return request.cookies.get("shealert_session")?.value ?? null
}

export async function getCurrentUser(request: NextRequest): Promise<User | null> {
  const token = await getSessionToken(request)
  if (!token) {
    return null
  }

  const db = await readDb()
  const session = db.sessions.find((item) => item.token === token)
  if (!session) {
    return null
  }

  return db.users.find((item) => item.id === session.userId) ?? null
}
