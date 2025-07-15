import { type NextRequest, NextResponse } from "next/server"

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  global_name?: string
  avatar?: string
}

interface ApiResponse {
  name: string
  displayname: string
  avatar: string
  discriminator?: string
  id?: string
  success: boolean
  error?: string
}

// Эта функция getDiscordUserInfo не используется напрямую в этом файле,
// но оставлена для контекста, если бы этот маршрут напрямую обрабатывал логику.
// Основная логика получения данных перенесена в app/api/discord/route.ts
async function getDiscordUserInfo(userId: string): Promise<ApiResponse> {
  if (!DISCORD_BOT_TOKEN) {
    return {
      name: "",
      displayname: "",
      avatar: "",
      success: false,
      error: "Discord bot token not configured. Please add DISCORD_BOT_TOKEN environment variable.",
    }
  }

  if (!/^\d{17,19}$/.test(userId)) {
    return {
      name: "",
      displayname: "",
      avatar: "",
      success: false,
      error: "Invalid Discord User ID format. Must be 17-19 digits.",
    }
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return {
          name: "",
          displayname: "",
          avatar: "",
          success: false,
          error: "User not found. Check if the User ID is correct.",
        }
      }
      if (response.status === 401) {
        return {
          name: "",
          displayname: "",
          avatar: "",
          success: false,
          error: "Invalid Discord bot token. Please check your token configuration.",
        }
      }
      return {
        name: "",
        displayname: "",
        avatar: "",
        success: false,
        error: `Discord API error: ${response.status} - ${response.statusText}`,
      }
    }

    const userData: DiscordUser = await response.json()

    let avatarUrl = ""
    if (userData.avatar) {
      avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.png?size=1024`
    } else {
      const discriminator = Number.parseInt(userData.discriminator || "0")
      const defaultAvatarId = discriminator % 5
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png`
    }

    return {
      name: userData.username || "",
      displayname: userData.global_name || userData.username || "",
      avatar: avatarUrl,
      discriminator: userData.discriminator,
      id: userData.id,
      success: true,
    }
  } catch (error) {
    return {
      name: "",
      displayname: "",
      avatar: "",
      success: false,
      error: `Request failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userid")

  const exampleUserId = "470573716711931905" // Пример ID пользователя
  const baseUrl = request.nextUrl.origin // Получаем базовый URL текущего запроса

  if (userId) {
    // Перенаправляем на основной API-маршрут для получения данных пользователя
    const discordApiUrl = new URL("/api/discord", baseUrl)
    discordApiUrl.searchParams.set("userid", userId)

    const response = await fetch(discordApiUrl.toString())
    const data = await response.json()

    return NextResponse.json(data, {
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    })
  }

  return NextResponse.json(
    {
      message: "Discord API - Получите информацию о пользователе по его ID.",
      endpoints: {
        "GET /api/discord?userid=USER_ID": "Получить информацию о пользователе Discord",
        "GET /api/health": "Проверка работоспособности API",
        "GET /api/status": "Статус конфигурации токена бота",
      },
      example_usage: {
        description: "Пример GET-запроса для получения информации о пользователе:",
        url: `${baseUrl}/api/discord?userid=${exampleUserId}`,
        sample_response: {
          name: "anime.228",
          displayname: "Aнимеш ник228",
          avatar_static:
            "https://cdn.discordapp.com/avatars/470573716711931905/3e5f56c15503b79ae3e1fa6cafc7bbbd.png?size=1024",
          avatar_animated:
            "https://cdn.discordapp.com/avatars/470573716711931905/a_3e5f56c15503b79ae3e1fa6cafc7bbbd.gif?size=1024",
          discriminator: "0000",
          id: "470573716711931905",
          registered_at: "2018-07-15T11:45:12.000Z",
          banner_static: "https://cdn.discordapp.com/banners/470573716711931905/banner_hash.png?size=1024",
          banner_animated: "https://cdn.discordapp.com/banners/470573716711931905/a_banner_hash.gif?size=1024",
          banner_color: "#FF00FF",
          accent_color: "#00FF00",
          bio: "Привет! Я пользователь Discord.",
          public_flags: 65536,
          is_bot: false,
          is_system: false,
          mfa_enabled: true,
          locale: "ru",
          premium_type: "Nitro",
          success: true,
        },
      },
      success: true,
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    },
  )
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
