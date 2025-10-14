// contexts/GameInviteSocketProvider.tsx
'use client'

import { CreateGameInviteInput, GAME_INVITE_EVENTS, GAME_INVITE_ROOM_EVENTS } from '@/events/game-invite.events'
import { ENV } from '@/config/env'
import { Game, GameInvite, PlayersPressenceStatus, SocketResponse, User } from '@/types'
import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
    useCallback,
} from 'react'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

// Define event callback types
type InviteReceivedCallback = (data: SocketResponse<GameInvite>) => void

type InviteAcceptedCallback = (data: SocketResponse<{
    gameInvite: GameInvite
    acceptor: User
}>) => void

type InviteDeclinedCallback = (data: SocketResponse<{
    gameInviteId: string
    declinedInvite: GameInvite
    decliner: User
}>) => void

type InviteCanceledCallback = (data: SocketResponse<{
    gameInviteId: string
    deletedGameInvite: GameInvite
}>) => void


type GameUpdateCallback = (data: any) => void

type GameInviteRoomPresenceCallback = (data: SocketResponse<{
    gameInviteId: string;
    playerStatuses: PlayersPressenceStatus;
}>) => void;

type StartGameCallback = (data: SocketResponse<{
    game: Game
}>) => void;

interface GameInviteSocketContextType {
    socket: Socket | null
    isConnected: boolean
    isError: boolean          // ✅ Added
    error: string | null     // ✅ Added

    // Actions
    createInvite: (payload: CreateGameInviteInput) => void
    acceptInvite: (inviteId: string) => void
    declineInvite: (inviteId: string) => void
    cancelInvite: (gameInviteId: string) => void
    joinGameInviteRoom: (gameInviteId: string) => void
    updatePlayerReadyStatusGameInviteRoom: (gameInviteId: string) => void
    leaveGameInviteRoom: (gameInviteId: string) => void
    startGame: (gameInviteId: string) => void

    // Event subscriptions
    onInviteReceived: (callback: InviteReceivedCallback) => () => void
    onInviteAccepted: (callback: InviteAcceptedCallback) => () => void
    onInviteDeclined: (callback: InviteDeclinedCallback) => () => void
    onInviteCanceled: (callback: InviteCanceledCallback) => () => void
    onGameUpdate: (callback: GameUpdateCallback) => () => void
    onGameInviteRoomPresence: (callback: GameInviteRoomPresenceCallback) => () => void
    onGameStarted: (callback: StartGameCallback) => () => void
}

const GameInviteSocketContext = createContext<GameInviteSocketContextType>({
    socket: null,
    isConnected: false,
    isError: false,           // ✅ Default
    error: null,              // ✅ Default
    createInvite: () => { },
    acceptInvite: () => { },
    declineInvite: () => { },
    cancelInvite: () => { },
    joinGameInviteRoom: () => { },
    updatePlayerReadyStatusGameInviteRoom: () => { },
    leaveGameInviteRoom: () => { },
    onGameInviteRoomPresence: () => () => { },
    startGame: () => () => { },
    onInviteReceived: () => () => { },
    onInviteAccepted: () => () => { },
    onInviteDeclined: () => () => { },
    onInviteCanceled: () => () => { },
    onGameUpdate: () => () => { },
    onGameStarted: () => () => { },
})

interface GameInviteSocketProviderProps {
    accessToken: string
    children: ReactNode
}

export function GameInviteSocketProvider({
    accessToken,
    children,
}: GameInviteSocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isError, setIsError] = useState(false)        // ✅ Added
    const [error, setError] = useState<string | null>(null) // ✅ Added

    const namespace = '/game-invite'

    // Store callbacks in refs
    const inviteReceivedCallbacks = useRef<InviteReceivedCallback[]>([])
    const inviteAcceptedCallbacks = useRef<InviteAcceptedCallback[]>([])
    const inviteDeclinedCallbacks = useRef<InviteDeclinedCallback[]>([])
    const inviteCanceledCallbacks = useRef<InviteCanceledCallback[]>([])
    const gameUpdateCallbacks = useRef<GameUpdateCallback[]>([])
    const gameInviteRoomPresenceCallbacks = useRef<((data: any) => void)[]>([]);
    const startGameCallbacks = useRef<StartGameCallback[]>([]);


    // Action functions
    const createInvite = useCallback((payload: CreateGameInviteInput) => {
        socket?.emit(GAME_INVITE_EVENTS.CREATE, payload)
    }, [socket])

    const acceptInvite = useCallback((gameInviteId: string) => {
        socket?.emit(GAME_INVITE_EVENTS.ACCEPT, { gameInviteId })
    }, [socket]) 

    const declineInvite = useCallback((gameInviteId: string) => {
        socket?.emit(GAME_INVITE_EVENTS.DECLINE, { gameInviteId })
    }, [socket])

    const cancelInvite = useCallback((gameInviteId: string) => {
        socket?.emit(GAME_INVITE_EVENTS.CANCEL, { gameInviteId })
    }, [socket])

    const joinGameInviteRoom = useCallback((gameInviteId: string) => {
        console.log("JOIN GAME INVITE ROOM", { gameInviteId })
        socket?.emit(GAME_INVITE_ROOM_EVENTS.JOIN, { gameInviteId })
    }, [socket]) 

    const updatePlayerReadyStatusGameInviteRoom = useCallback((gameInviteId: string) => {
        console.log("JOIN GAME INVITE ROOM", { gameInviteId })
        socket?.emit(GAME_INVITE_ROOM_EVENTS.PLAYER_READY, { gameInviteId })
    }, [socket])

    const leaveGameInviteRoom = useCallback((gameInviteId: string) => {
        console.log("JOIN GAME INVITE ROOM", { gameInviteId })
        socket?.emit(GAME_INVITE_ROOM_EVENTS.LEAVE, { gameInviteId })
    }, [socket])

    const startGame = useCallback((gameInviteId: string) => {
        console.log("STARTING A GAME", { gameInviteId })
        socket?.emit(GAME_INVITE_ROOM_EVENTS.START, { gameInviteId })
    }, [socket])

    // Subscription methods
    const onInviteReceived = useCallback((callback: InviteReceivedCallback) => {
        inviteReceivedCallbacks.current.push(callback)
        return () => {
            inviteReceivedCallbacks.current = inviteReceivedCallbacks.current.filter(
                cb => cb !== callback
            )
        }
    }, [])

    const onInviteAccepted = useCallback((callback: InviteAcceptedCallback) => {
        inviteAcceptedCallbacks.current.push(callback)
        return () => {
            inviteAcceptedCallbacks.current = inviteAcceptedCallbacks.current.filter(
                cb => cb !== callback
            )
        }
    }, [])

    const onInviteDeclined = useCallback((callback: InviteDeclinedCallback) => {
        inviteDeclinedCallbacks.current.push(callback)
        return () => {
            inviteDeclinedCallbacks.current = inviteDeclinedCallbacks.current.filter(
                cb => cb !== callback
            )
        }
    }, [])

    const onInviteCanceled = useCallback((callback: InviteCanceledCallback) => {
        inviteCanceledCallbacks.current.push(callback)
        return () => {
            inviteCanceledCallbacks.current = inviteCanceledCallbacks.current.filter(
                cb => cb !== callback
            )
        }
    }, [])

    const onGameUpdate = useCallback((callback: GameUpdateCallback) => {
        gameUpdateCallbacks.current.push(callback)
        return () => {
            gameUpdateCallbacks.current = gameUpdateCallbacks.current.filter(
                cb => cb !== callback
            )
        }
    }, [])

    const onGameStarted = useCallback((callback: StartGameCallback) => {
        startGameCallbacks.current.push(callback)
        return () => {
            startGameCallbacks.current = startGameCallbacks.current.filter(
                cb => cb !== callback
            )
        }
    }, [])


    // Add subscription method
    const onGameInviteRoomPresence = useCallback((callback: (data: any) => void) => {
        gameInviteRoomPresenceCallbacks.current.push(callback);
        return () => {
            gameInviteRoomPresenceCallbacks.current = gameInviteRoomPresenceCallbacks.current.filter(cb => cb !== callback);
        };
    }, []);


    useEffect(() => {
        const wsUrl = ENV.NEXT_PUBLIC_WS_URL
        const fullUrl = `${wsUrl}${namespace}`

        const socketInstance = io(fullUrl, {
            auth: { token: accessToken },
            reconnection: true,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            transports: ['websocket', 'polling'],
        })

        // Event listeners
        socketInstance.on(GAME_INVITE_EVENTS.RECEIVED, (data) => {
            inviteReceivedCallbacks.current.forEach(cb => cb(data))
        })

        socketInstance.on(GAME_INVITE_EVENTS.ACCEPTED, (data: any) => {
            inviteAcceptedCallbacks.current.forEach(cb => cb(data))
        })

        socketInstance.on(GAME_INVITE_EVENTS.DECLINED, (data: any) => {
            inviteDeclinedCallbacks.current.forEach(cb => cb(data))
        })

        socketInstance.on(GAME_INVITE_EVENTS.CANCELED, (data: any) => {
            inviteCanceledCallbacks.current.forEach(cb => cb(data))
        })

        socketInstance.on('game_update', (data: any) => {
            gameUpdateCallbacks.current.forEach(cb => cb(data))
        })

        socketInstance.on(GAME_INVITE_ROOM_EVENTS.STARTED, (data: any) => {
            startGameCallbacks.current.forEach(cb => cb(data))
        })


        socketInstance.on(GAME_INVITE_ROOM_EVENTS.PRESENCE, (data) => {
            gameInviteRoomPresenceCallbacks.current.forEach(cb => cb(data));
        });


        // Connection handlers
        socketInstance.on('connect', () => {
            setIsConnected(true)
            setIsError(false)
            setError(null)
            console.log('🟢 Game invite socket connected')
            // toast.success('✅ Connected to game invites')
        })

        socketInstance.on('disconnect', (reason) => {
            setIsConnected(false)
            // Don't set error on clean disconnect
            toast.error('🔴 Game invite socket disconnected.')
            console.log('🔴 Game invite socket disconnected:', reason)
        })

        socketInstance.on('connect_error', (err) => {
            setIsConnected(false)
            setIsError(true)
            setError(err.message)
            console.error('❌ Game invite connection error:', err)
            toast.error(`Game invite error: ${err.message}`)
        })

        // Also handle general 'error' event
        socketInstance.on('error', (err) => {
            setIsError(true)
            setError(err.message)
            toast.error(err?.message || '❌ Game invite runtime error.',)
            console.error(err?.message || '❌ Game invite runtime error.', err)
        })

        setSocket(socketInstance)

        return () => {
            // Clean up
            socketInstance.off(GAME_INVITE_EVENTS.RECEIVED)
            socketInstance.off(GAME_INVITE_EVENTS.ACCEPTED)
            socketInstance.off(GAME_INVITE_EVENTS.DECLINED)
            socketInstance.off(GAME_INVITE_EVENTS.CANCELED)
            socketInstance.off('game_update')
            socketInstance.off(GAME_INVITE_ROOM_EVENTS.PRESENCE);
            socketInstance.off('connect')
            socketInstance.off('disconnect')
            socketInstance.off('connect_error')
            socketInstance.off('error')
            socketInstance.close()
        }
    }, [accessToken])

    return (
        <GameInviteSocketContext.Provider
            value={{
                socket,
                isConnected,
                isError,
                error,
                createInvite,
                acceptInvite,
                declineInvite,
                cancelInvite,
                joinGameInviteRoom,
                updatePlayerReadyStatusGameInviteRoom,
                leaveGameInviteRoom,
                startGame,
                onGameInviteRoomPresence,
                onInviteReceived,
                onInviteAccepted,
                onInviteDeclined,
                onInviteCanceled,
                onGameUpdate,
                onGameStarted
            }}
        >
            {children}
        </GameInviteSocketContext.Provider>
    )
}

export const useGameInviteSocket = () => {
    const context = useContext(GameInviteSocketContext)
    if (!context) {
        throw new Error(
            'useGameInviteSocket must be used within GameInviteSocketProvider'
        )
    }
    return context
}