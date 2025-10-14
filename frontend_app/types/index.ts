export type Tokens = { accessToken: string, refreshToken: string }


export type SocketResponse<T> = {
    message: string
    data: T
}

export type UserId = string
export type PlayerPresenceStatus = { isConnected: boolean; isReady: boolean }
export type PlayersPressenceStatus = Record<UserId, PlayerPresenceStatus>


export enum GAME_TYPE {
    TIC_TAC_TOE = "TIC_TAC_TOE",
    PENALTY = "PENALTY",
    CHESS = "CHESS"

}

export type Timestamp = {
    createdAt: string
    updatedAt: string
}


export type User = {
    id: string
    telegramId: string
    firstName: string
    lastName?: string
    username: string
    photoUrl?: string
}

export type UserDetail = User & {
    games: Game[],
    wallet: Wallet,
    userStatus: UserStatus

}

export type GamePlayer = {
    id: string
    userId: string
    gameId: string
    role?: string | null
    betAmount?: number | null

    // optional relational expansions
    user: User
    game: Game
}


export type GameConfig = {
    id: string
    gameType: GAME_TYPE
    minPlayers: number
    maxPlayers: number
    isActive: boolean
    round: number
    serviceCharge: number
} & Timestamp

export enum INVITE_STATUS {
    PENDING = "PENDING",
    ACCEPTED = "ACCEPTED",
    DECLINED = "DECLINED",
}


export enum GAME_STATUS {
    WAITING = "WAITING",
    ACTIVE = `ACTIVE`,
    FINISHED = `FINISHED`
}

export enum TRANSACTION_TYPE {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    BET = "BET",
    WIN = "WIN",
    GIFT = "GIFT",
}



export type GameInvite = {
    id: string
    gameId: string | null
    fromUserId: string
    gameType: GAME_TYPE
    bet: number
    maxPlayers: number
    status: INVITE_STATUS
    expiresAt?: string | null
    acceptedAt?: string | null
    declinedAt?: string | null

    // optional relational expansions
    fromUser?: User
    game: Game | null
    toUsers: User[]
} & Timestamp

export type GameInviteWithGame = GameInvite & {
    game?: Game
}



export type Game = {
    id: string
    type: GAME_TYPE
    status: GAME_STATUS
    state?: Record<string, any> | null
    roundNumber: number

    startedAt?: string | null
    winnerId?: string | null

    gameInviteId: string
    createdAt: string
    updatedAt: string

    // optional relational expansions
    winner?: {
        id: string
        username: string
        photoURL?: string | null
    } | null

    gameInvite: GameInvite
    players: GamePlayer[]
    transactions: Transaction[]
}

export type Transaction = {
    id: string
    walletId: string
    type: TRANSACTION_TYPE
    amount: number
    gameId?: string | null
    createdAt: string

    // optional relational expansions
    wallet?: Wallet
    game?: Game
}

export type Wallet = {
    id: string
    userId: string
    balance: number
    currency: string

    // optional relational expansions
    user?: User
    transactions?: Transaction[]
} & Timestamp

export type UserStatus = {
    userId: string
    isSuspended: boolean
    isBanned: boolean
    isVerified: boolean
    warningCount: number

    user?: User
} & Timestamp


