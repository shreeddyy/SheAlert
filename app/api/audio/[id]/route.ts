import { promises as fs } from "fs"
import path from "path"
import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"
import { readDb, writeDb } from "@/lib/server/db"

type Context = {
  params: Promise<{ id: string }>
}

export async function DELETE(request: NextRequest, context: Context) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ error: "Please sign in to delete recordings." }, { status: 401 })
  }

  const { id } = await context.params
  const db = await readDb()
  const record = db.audioRecords.find((item) => item.id === id && item.userId === user.id)

  if (!record) {
    return NextResponse.json({ error: "Recording not found." }, { status: 404 })
  }

  const absolutePath = path.join(process.cwd(), "public", record.filePath.replace(/^\//, ""))
  await fs.unlink(absolutePath).catch(() => undefined)

  await writeDb((state) => ({
    ...state,
    audioRecords: state.audioRecords.filter((item) => item.id !== id),
  }))

  return NextResponse.json({ success: true })
}
