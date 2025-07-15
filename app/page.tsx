"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"

interface UserInfo {
  name: string
  displayname: string
  avatar_static: string
  avatar_animated?: string
  discriminator?: string
  id?: string
  registered_at?: string
  banner_static?: string
  banner_animated?: string
  banner_color?: string
  accent_color?: string
  bio?: string
  public_flags?: number
  is_bot?: boolean // Добавлено
  is_system?: boolean // Добавлено
  mfa_enabled?: boolean // Добавлено
  locale?: string // Добавлено
  premium_type?: string // Добавлено
  success: boolean
  error?: string
}

// Вспомогательная функция для интерпретации public_flags
const getPublicFlags = (flags: number | undefined) => {
  if (flags === undefined) return "N/A"
  const flagNames: string[] = []
  if (flags & (1 << 0)) flagNames.push("Discord Employee")
  if (flags & (1 << 1)) flagNames.push("Partnered Server Owner")
  if (flags & (1 << 2)) flagNames.push("HypeSquad Events")
  if (flags & (1 << 3)) flagNames.push("Bug Hunter Level 1")
  if (flags & (1 << 6)) flagNames.push("House Bravery")
  if (flags & (1 << 7)) flagNames.push("House Brilliance")
  if (flags & (1 << 8)) flagNames.push("House Balance")
  if (flags & (1 << 9)) flagNames.push("Early Supporter")
  if (flags & (1 << 10)) flagNames.push("Team User")
  if (flags & (1 << 12)) flagNames.push("System")
  if (flags & (1 << 13)) flagNames.push("Bug Hunter Level 2")
  if (flags & (1 << 14)) flagNames.push("Verified Bot")
  if (flags & (1 << 16)) flagNames.push("Early Verified Bot Developer")
  if (flags & (1 << 17)) flagNames.push("Discord Certified Moderator")
  if (flags & (1 << 18)) flagNames.push("Bot HTTP Interactions")
  if (flags & (1 << 19)) flagNames.push("Active Developer")
  if (flags & (1 << 22)) flagNames.push("Quarantined")
  return flagNames.length > 0 ? flagNames.join(", ") : "Нет специальных флагов"
}

export default function DiscordAPITest() {
  const [userId, setUserId] = useState("470573716711931905")
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)

  const getUserInfo = async () => {
    if (!userId.trim()) {
      setUserInfo({
        name: "",
        displayname: "",
        avatar_static: "",
        success: false,
        error: "Введите User ID",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/discord?userid=${userId}`)
      const data = await response.json()
      setUserInfo(data)
    } catch (error) {
      setUserInfo({
        name: "",
        displayname: "",
        avatar_static: "",
        success: false,
        error: `Ошибка запроса: ${error instanceof Error ? error.message : "Unknown error"}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      getUserInfo()
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Discord API Test</CardTitle>
            <p className="text-center text-muted-foreground">Введите Discord User ID для получения информации</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Discord User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={getUserInfo} disabled={loading} className="bg-[#5865F2] hover:bg-[#4752C4]">
                {loading ? "Загрузка..." : "Получить"}
              </Button>
            </div>

            {userInfo && (
              <Card className="mt-6">
                <CardContent className="pt-6">
                  {userInfo.success ? (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Информация о пользователе:</h3>

                      {userInfo.banner_animated || userInfo.banner_static ? (
                        <div className="w-full h-32 rounded-lg overflow-hidden mb-4 relative">
                          <img
                            src={userInfo.banner_animated || userInfo.banner_static || "/placeholder.svg"}
                            alt="User Banner"
                            className="w-full h-full object-cover"
                          />
                          {userInfo.banner_animated && (
                            <span className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
                              Анимированный
                            </span>
                          )}
                        </div>
                      ) : null}

                      {userInfo.banner_color && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Цвет баннера:</span>
                          <div
                            className="w-6 h-6 rounded-full border border-border"
                            style={{ backgroundColor: userInfo.banner_color }}
                          ></div>
                          <span>{userInfo.banner_color}</span>
                        </div>
                      )}
                      {userInfo.accent_color && (
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">Акцентный цвет:</span>
                          <div
                            className="w-6 h-6 rounded-full border border-border"
                            style={{ backgroundColor: userInfo.accent_color }}
                          ></div>
                          <span>{userInfo.accent_color}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 relative">
                          <AvatarImage
                            src={userInfo.avatar_animated || userInfo.avatar_static || "/placeholder.svg"}
                            alt="Discord Avatar"
                          />
                          <AvatarFallback>{userInfo.name.charAt(0).toUpperCase()}</AvatarFallback>
                          {userInfo.avatar_animated && (
                            <span className="absolute bottom-0 right-0 bg-black bg-opacity-50 text-white text-[0.6rem] px-1 py-0.5 rounded-full">
                              GIF
                            </span>
                          )}
                        </Avatar>

                        <div className="space-y-1">
                          <p>
                            <strong>Имя:</strong> {userInfo.name}
                          </p>
                          <p>
                            <strong>Отображаемое имя:</strong> {userInfo.displayname}
                          </p>
                          <p>
                            <strong>ID:</strong> {userInfo.id}
                          </p>
                          {userInfo.discriminator && (
                            <p>
                              <strong>Дискриминатор:</strong> #{userInfo.discriminator}
                            </p>
                          )}
                          {userInfo.registered_at && (
                            <p>
                              <strong>Дата регистрации:</strong>{" "}
                              {new Date(userInfo.registered_at).toLocaleDateString("ru-RU", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          )}
                          {userInfo.is_bot !== undefined && (
                            <p>
                              <strong>Бот:</strong> {userInfo.is_bot ? "Да" : "Нет"}
                            </p>
                          )}
                          {userInfo.is_system !== undefined && (
                            <p>
                              <strong>Системный пользователь:</strong> {userInfo.is_system ? "Да" : "Нет"}
                            </p>
                          )}
                          {userInfo.mfa_enabled !== undefined && (
                            <p>
                              <strong>2FA включена:</strong> {userInfo.mfa_enabled ? "Да" : "Нет"}
                            </p>
                          )}
                          {userInfo.locale && (
                            <p>
                              <strong>Язык:</strong> {userInfo.locale}
                            </p>
                          )}
                          {userInfo.premium_type && (
                            <p>
                              <strong>Тип Nitro:</strong> {userInfo.premium_type}
                            </p>
                          )}
                        </div>
                      </div>

                      {userInfo.bio && (
                        <div>
                          <h4 className="font-semibold mt-4 mb-2">Обо мне:</h4>
                          <p className="text-muted-foreground">{userInfo.bio}</p>
                        </div>
                      )}

                      {userInfo.public_flags !== undefined && (
                        <div>
                          <h4 className="font-semibold mt-4 mb-2">Публичные флаги:</h4>
                          <p className="text-muted-foreground">{getPublicFlags(userInfo.public_flags)}</p>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold mt-4 mb-2">JSON ответ:</h4>
                        <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                          {JSON.stringify(userInfo, null, 2)}
                        </pre>
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertDescription>
                        <strong>Ошибка:</strong> {userInfo.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Использование API:</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>GET запрос:</strong>
                  </p>
                  <code className="block bg-muted p-2 rounded">
                    {typeof window !== "undefined" ? window.location.origin : "https://your-domain.vercel.app"}
                    /api/discord?userid=470573716711931905
                  </code>
                  <p className="text-muted-foreground text-xs mt-1">
                    (Замените `470573716711931905` на нужный User ID)
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
