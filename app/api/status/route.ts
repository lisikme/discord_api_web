import { NextResponse } from "next/server"

export async function GET() {
  const hasToken = !!process.env.DISCORD_BOT_TOKEN

  return NextResponse.json({
    status: "API is running",
    configured: hasToken,
    message: hasToken
      ? "Discord bot token is configured"
      : "Discord bot token is missing. Add DISCORD_BOT_TOKEN environment variable.",
    timestamp: new Date().toISOString(),
    success: true,
  })
}
