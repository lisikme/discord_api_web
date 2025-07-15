import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    status: "API is running",
    success: true,
    timestamp: new Date().toISOString(),
  })
}
