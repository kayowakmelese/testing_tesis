// contexts/PenaltySocketProvider.tsx
'use client'

import { ENV } from '@/config/env'
import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react'
import { Socket, io } from 'socket.io-client'

// Callback types for penalty game
type GameCreatedCallback = (game: any) => void
type GameUpdateCallback = (game: any) => void
type GameWonCallback = (game: any) => void
type ErrorCallback = (error: { message: string; errors?: any }) => void

interface PenaltySocketContextType {
    socket: Socket | null
    isConnected: boolean
    isError: boolean
    error: string | null

    // Actions
    createGame: (payload: any) => void
    makeMove: (payload: any) => void
    joinGame: (gameId: string) => void

    // Subscriptions
    onGameCreated: (callback: GameCreatedCallback) => () => void
    onGameUpdate: (callback: GameUpdateCallback) => () => void
    onGameWon: (callback: GameWonCallback) => () => void
    onError: (callback: ErrorCallback) => () => void
}

const PenaltySocketContext = createContext<PenaltySocketContextType>({
    socket: null,
    isConnected: false,
    isError: false,
    error: null,
    createGame: () => { },
    makeMove: () => { },
    joinGame: () => { },
    onGameCreated: () => () => { },
    onGameUpdate: () => () => { },
    onGameWon: () => () => { },
    onError: () => () => { },
})

interface PenaltySocketProviderProps {
    accessToken: string
    children: ReactNode
}

export function PenaltySocketProvider({ accessToken, children }: PenaltySocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const namespace = '/penalty'

    // Callback refs
    const gameCreatedCallbacks = useRef<GameCreatedCallback[]>([])
    const gameUpdateCallbacks = useRef<GameUpdateCallback[]>([])
    const gameWonCallbacks = useRef<GameWonCallback[]>([])
    const errorCallbacks = useRef<ErrorCallback[]>([])

    // Actions
    const createGame = useCallback((payload: any) => {
        socket?.emit('create_game', payload)
    }, [socket])

    const makeMove = useCallback((payload: any) => {
        console.log("making move...")
        socket?.emit('make_move', payload)
    }, [socket])

    const joinGame = useCallback((gameId: string) => {
        socket?.emit('join_game', { gameId })
    }, [socket])

    // Subscriptions
    const onGameCreated = useCallback((callback: GameCreatedCallback) => {
        gameCreatedCallbacks.current.push(callback)
        return () => {
            gameCreatedCallbacks.current = gameCreatedCallbacks.current.filter(cb => cb !== callback)
        }
    }, [])

    const onGameUpdate = useCallback((callback: GameUpdateCallback) => {
        gameUpdateCallbacks.current.push(callback)
        return () => {
            gameUpdateCallbacks.current = gameUpdateCallbacks.current.filter(cb => cb !== callback)
        }
    }, [])

    const onGameWon = useCallback((callback: GameWonCallback) => {
        gameWonCallbacks.current.push(callback)
        return () => {
            gameWonCallbacks.current = gameWonCallbacks.current.filter(cb => cb !== callback)
        }
    }, [])

    const onError = useCallback((callback: ErrorCallback) => {
        errorCallbacks.current.push(callback)
        return () => {
            errorCallbacks.current = errorCallbacks.current.filter(cb => cb !== callback)
        }
    }, [])

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
        socketInstance.on('game_created', (game) => {
            gameCreatedCallbacks.current.forEach(cb => cb(game))
        })

        socketInstance.on('game_update', (game) => {
            gameUpdateCallbacks.current.forEach(cb => cb(game))
        })

        socketInstance.on('game_won', (game) => {
            gameWonCallbacks.current.forEach(cb => cb(game))
        })

        socketInstance.on('error', (error) => {
            errorCallbacks.current.forEach(cb => cb(error))
        })

        // Connection handlers
        socketInstance.on('connect', () => {
            setIsConnected(true)
            setIsError(false)
            setError(null)
            console.log('🟢 Penalty socket connected')
            // toast.success('✅ Connected to penalty game')
        })

        socketInstance.on('disconnect', (reason) => {
            setIsConnected(false)
            console.log('🔴 Penalty socket disconnected:', reason)
        })

        socketInstance.on('connect_error', (err) => {
            setIsConnected(false)
            setIsError(true)
            setError(err.message)
            console.error('❌ Penalty connection error:', err)
            // toast.error(`Penalty error: ${err.message}`)
        })

        setSocket(socketInstance)

        return () => {
            // Clean up
            socketInstance.off('game_created')
            socketInstance.off('game_update')
            socketInstance.off('game_won')
            socketInstance.off('error')
            socketInstance.off('connect')
            socketInstance.off('disconnect')
            socketInstance.off('connect_error')
            socketInstance.close()
        }
    }, [accessToken])

    return (
        <PenaltySocketContext.Provider
            value={{
                socket,
                isConnected,
                isError,
                error,
                createGame,
                makeMove,
                joinGame,
                onGameCreated,
                onGameUpdate,
                onGameWon,
                onError,
            }}
        >
            {children}
        </PenaltySocketContext.Provider>
    )
}

export const usePenaltySocket = () => {
    const context = useContext(PenaltySocketContext)
    if (!context) {
        throw new Error('usePenaltySocket must be used within PenaltySocketProvider')
    }
    return context
}