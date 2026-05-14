import { NextRequest, NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/server/auth"

export async function GET(request: NextRequest) {
  const user = await getCurrentUser(request)
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email },
  })
}
