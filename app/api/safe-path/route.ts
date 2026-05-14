import { NextRequest, NextResponse } from "next/server"

import { getSafeLocations } from "@/lib/server/safe-path"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const latitude = Number(searchParams.get("latitude"))
  const longitude = Number(searchParams.get("longitude"))

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return NextResponse.json({ error: "Latitude and longitude are required." }, { status: 400 })
  }

  return NextResponse.json({
    safeLocations: getSafeLocations(latitude, longitude),
  })
}
