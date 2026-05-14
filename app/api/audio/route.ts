import { promises as fs } from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"
import type { AudioRecord } from "@/lib/types"

const uploadDir = path.join(process.cwd(), "public", "uploads")

async function ensureUploadDir() {
  await fs.mkdir(uploadDir, { recursive: true })
}

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ recordings: [] })
  }

  const db = await readDb()
  return NextResponse.json({
    recordings: db.audioRecords.filter((record) => record.userId === user.id),
  })
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to save recordings." }, { status: 401 })
  }

  await ensureUploadDir()
  const formData = await request.formData()
  const file = formData.get("file")
  const duration = Number(formData.get("duration") ?? 0)

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Audio file is required." }, { status: 400 })
  }

  const extension = file.type === "audio/webm" ? "webm" : "bin"
  const filename = `${Date.now()}-${crypto.randomUUID()}.${extension}`
  const filePath = path.join(uploadDir, filename)
  const buffer = Buffer.from(await file.arrayBuffer())
  await fs.writeFile(filePath, buffer)

  const record: AudioRecord = {
    id: crypto.randomUUID(),
    userId: user.id,
    filename,
    mimeType: file.type || "application/octet-stream",
    duration,
    size: file.size,
    filePath: `/uploads/${filename}`,
    createdAt: new Date().toISOString(),
  }

  await writeDb((db) => ({
    ...db,
    audioRecords: [...db.audioRecords, record],
  }))

  return NextResponse.json({ record }, { status: 201 })
}
