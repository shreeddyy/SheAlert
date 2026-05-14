import { promises as fs } from "fs"
import path from "path"

import type { DatabaseSchema } from "@/lib/types"

const DB_PATH = path.join(process.cwd(), "data", "app-db.json")

const defaultDb: DatabaseSchema = {
  users: [],
  sessions: [],
  contacts: [],
  sosAlerts: [],
  locationShares: [],
  threatAnalyses: [],
  audioRecords: [],
  safetyPlans: [],
  journeys: [],
}

let writeQueue = Promise.resolve()

async function ensureDbFile() {
  try {
    await fs.access(DB_PATH)
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2), "utf8")
  }
}

export async function readDb(): Promise<DatabaseSchema> {
  await ensureDbFile()
  const raw = await fs.readFile(DB_PATH, "utf8")
  return { ...defaultDb, ...JSON.parse(raw) } as DatabaseSchema
}

export async function writeDb(updater: (db: DatabaseSchema) => DatabaseSchema | Promise<DatabaseSchema>) {
  writeQueue = writeQueue.then(async () => {
    const current = await readDb()
    const next = await updater(current)
    await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf8")
  })

  await writeQueue
}
