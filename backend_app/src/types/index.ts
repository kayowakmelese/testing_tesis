export type JwtPayload = {
    userId: string
    telegramId: string
}

export type PlayerPresenceStatus = { isConnected: boolean; isReady: boolean }
export type UserId = string
export type PlayersPressenceStatus = Record<UserId, PlayerPresenceStatus>
