import { type NextRequest, NextResponse } from "next/server"

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  global_name?: string
  avatar?: string // Хэш аватара
  banner?: string // Хэш баннера
  banner_color?: number // Цвет баннера (integer)
  accent_color?: number // Акцентный цвет (integer)
  bio?: string // Описание профиля "Обо мне"
  public_flags?: number // Публичные флаги пользователя
  bot?: boolean // Добавлено
  system?: boolean // Добавлено
  mfa_enabled?: boolean // Добавлено
  locale?: string // Добавлено
  premium_type?: number // Добавлено
}

interface ApiResponse {
  name: string
  displayname: string
  avatar_static: string // Статичный URL аватара
  avatar_animated?: string // Анимированный URL аватара (если есть)
  discriminator?: string
  id?: string
  registered_at?: string // Дата регистрации
  banner_static?: string // Статичный URL баннера (если есть)
  banner_animated?: string // Анимированный URL баннера (если есть)
  banner_color?: string // Цвет баннера (HEX)
  accent_color?: string // Акцентный цвет (HEX)
  bio?: string
  public_flags?: number
  is_bot?: boolean // Добавлено
  is_system?: boolean // Добавлено
  mfa_enabled?: boolean // Добавлено
  locale?: string // Добавлено
  premium_type?: string // Добавлено (строковое представление)
  success: boolean
  error?: string
}

// Discord Epoch (2015-01-01T00:00:00.000Z)
const DISCORD_EPOCH = 1420070400000

// Функция для извлечения даты из Discord Snowflake ID
function getTimestampFromSnowflake(snowflake: string): Date | undefined {
  try {
    const idBigInt = BigInt(snowflake)
    const timestamp = (idBigInt >> 22n) + BigInt(DISCORD_EPOCH)
    return new Date(Number(timestamp))
  } catch (e) {
    console.error("Failed to parse snowflake:", e)
    return undefined
  }
}

// Функция для конвертации integer цвета в HEX
function intToHexColor(color?: number): string | undefined {
  if (color === undefined || color === null) return undefined
  return `#${color.toString(16).padStart(6, "0")}`
}

// Функция для получения типа Nitro
function getPremiumType(type?: number): string {
  switch (type) {
    case 1:
      return "Nitro Classic"
    case 2:
      return "Nitro"
    case 3:
      return "Nitro Basic"
    default:
      return "None"
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userid")

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  }

  if (!userId) {
    return NextResponse.json(
      {
        name: "",
        displayname: "",
        avatar_static: "",
        success: false,
        error: "userid parameter is required",
      },
      { status: 400, headers },
    )
  }

  if (!DISCORD_BOT_TOKEN) {
    return NextResponse.json(
      {
        name: "",
        displayname: "",
        avatar_static: "",
        success: false,
        error: "Discord bot token not configured",
      },
      { status: 500, headers },
    )
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          name: "",
          displayname: "",
          avatar_static: "",
          success: false,
          error: `Discord API error: ${response.status}`,
        },
        { status: response.status, headers },
      )
    }

    const userData: DiscordUser = await response.json()

    let avatarStaticUrl: string
    let avatarAnimatedUrl: string | undefined

    if (userData.avatar) {
      const isAnimatedAvatar = userData.avatar.startsWith("a_")
      avatarStaticUrl = `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.png?size=1024`
      if (isAnimatedAvatar) {
        avatarAnimatedUrl = `https://cdn.discordapp.com/avatars/${userId}/${userData.avatar}.gif?size=1024`
      }
    } else {
      const discriminator = Number.parseInt(userData.discriminator || "0")
      const defaultAvatarId = discriminator % 5
      avatarStaticUrl = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarId}.png`
    }

    let bannerStaticUrl: string | undefined
    let bannerAnimatedUrl: string | undefined

    if (userData.banner) {
      const isAnimatedBanner = userData.banner.startsWith("a_")
      bannerStaticUrl = `https://cdn.discordapp.com/banners/${userId}/${userData.banner}.png?size=1024`
      if (isAnimatedBanner) {
        bannerAnimatedUrl = `https://cdn.discordapp.com/banners/${userId}/${userData.banner}.gif?size=1024`
      }
    }

    const registeredAt = getTimestampFromSnowflake(userId)

    return NextResponse.json(
      {
        name: userData.username || "",
        displayname: userData.global_name || userData.username || "",
        avatar_static: avatarStaticUrl,
        avatar_animated: avatarAnimatedUrl,
        discriminator: userData.discriminator,
        id: userData.id,
        registered_at: registeredAt ? registeredAt.toISOString() : undefined,
        banner_static: bannerStaticUrl,
        banner_animated: bannerAnimatedUrl,
        banner_color: intToHexColor(userData.banner_color),
        accent_color: intToHexColor(userData.accent_color),
        bio: userData.bio,
        public_flags: userData.public_flags,
        is_bot: userData.bot, // Добавлено
        is_system: userData.system, // Добавлено
        mfa_enabled: userData.mfa_enabled, // Добавлено
        locale: userData.locale, // Добавлено
        premium_type: getPremiumType(userData.premium_type), // Добавлено
        success: true,
      },
      { headers },
    )
  } catch (error) {
    return NextResponse.json(
      {
        name: "",
        displayname: "",
        avatar_static: "",
        success: false,
        error: "Request failed",
      },
      { status: 500, headers },
    )
  }
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
