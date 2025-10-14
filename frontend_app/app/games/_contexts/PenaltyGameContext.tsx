'use client';

import {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    ReactNode,
    useCallback,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
import { ENV } from '@/config/env';
import { Game, GameConfig, User } from '@/types';
import { PenaltyGameState } from '@/types/penalty-game';
import { PENALTY_EVENTS } from '@/events/penalty.events';
import { useAuthUser, useGetAccessToken } from '@/stores/auth.store';

export type PenaltyGameDirection = "left" | "center" | "right"

// --- SocketResponse type ---
interface SocketResponse<T> {
    message: string;
    data: T;
}

// --- Types for callbacks ---
type GameUpdateCallback = (data: Game) => void;
type GameFinishedCallback = (data: { winnerId: string }) => void;
type GameInitCallback = (data: Game) => void;
type PresenceCallback = (data: { gameId: string; playerStatuses: Record<string, { isConnected: boolean }> }) => void;

interface PenaltyGameContextType {
    socket: Socket | null;
    isConnected: boolean;
    isError: boolean;
    error: string | null;

    // Game state
    game: Game & { config: GameConfig };
    gameState: PenaltyGameState | null;
    setGameState: React.Dispatch<React.SetStateAction<PenaltyGameState | null>>;

    // Actions
    joinGame: () => void;
    leaveGame: () => void;
    initGame: (shooter: User, goalkeeper: User) => void;
    makeMove: (direction: PenaltyGameDirection) => void;
    onGameInit: (callback: GameInitCallback) => () => void;
    // Subscriptions
    onGameUpdate: (callback: GameUpdateCallback) => () => void;
    onGameFinished: (callback: GameFinishedCallback) => () => void;
    onPresence: (callback: PresenceCallback) => () => void;
}

const PenaltyGameContext = createContext<PenaltyGameContextType | undefined>(
    undefined,
);

export const usePenaltyGame = () => {
    const context = useContext(PenaltyGameContext);
    if (!context) throw new Error('usePenaltyGame must be used within PenaltyGameProvider');
    return context;
};

interface PenaltyGameProviderProps {
    game: Game & { config: GameConfig };
    children: ReactNode;
}

export const PenaltyGameProvider = ({ game, children }: PenaltyGameProviderProps) => {
    const accessToken = useGetAccessToken();
    const currentUserId = useAuthUser().id;

    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [gameState, setGameState] = useState<PenaltyGameState | null>(null);

    // --- Callback refs ---
    const gameUpdateCallbacks = useRef<GameUpdateCallback[]>([]);
    const gameFinishedCallbacks = useRef<GameFinishedCallback[]>([]);
    const gameInitCallbacks = useRef<GameInitCallback[]>([]);
    const presenceCallbacks = useRef<PresenceCallback[]>([]);

    // --- Socket setup ---
    useEffect(() => {
        const namespace = '/penalty';
        const wsUrl = `${ENV.NEXT_PUBLIC_WS_URL}${namespace}`;

        const socketInstance = io(wsUrl, {
            auth: { token: accessToken },
            reconnection: true,
            reconnectionAttempts: Infinity,
            transports: ['websocket', 'polling'],
        });

        socketInstance.on('connect', () => {
            setIsConnected(true);
            setIsError(false);
            setError(null);
            console.log('🟢 Penalty socket connected');
        });

        socketInstance.on('disconnect', (reason) => {
            setIsConnected(false);
            toast.error('Penalty socket disconnected');
            console.log('🔴 Penalty socket disconnected:', reason);
        });

        socketInstance.on('connect_error', (err) => {
            setIsConnected(false);
            setIsError(true);
            setError(err.message);
            toast.error(`Penalty connection error: ${err.message}`);
        });

        // --- Server events (unwrap SocketResponse) ---
        socketInstance.on(PENALTY_EVENTS.GAME_UPDATE, (payload: SocketResponse<Game>) => {
            const { message, data } = payload;
            const gameStateData = data.state as PenaltyGameState;
            console.log('gameStateData:', { gameStateData });
            setGameState((prev) => (prev ? { ...prev, ...gameStateData } : null));
            gameUpdateCallbacks.current.forEach((cb) => cb(data));
            console.log('📡 GAME_UPDATE:', message, data);
        });

        socketInstance.on(PENALTY_EVENTS.GAME_INIT, (payload: SocketResponse<Game>) => {
            const { message, data } = payload;
            gameInitCallbacks.current.forEach((cb) => cb(data));
            console.log('📡 GAME_INIT:', message, data);
        });

        socketInstance.on(PENALTY_EVENTS.GAME_FINISHED, (payload: SocketResponse<{ winnerId: string }>) => {
            const { message, data } = payload;
            setGameState((prev) => prev ? ({ ...prev, winner: data.winnerId }) : null);
            gameFinishedCallbacks.current.forEach((cb) => cb(data));
            console.log('🏆 GAME_FINISHED:', message, data);
        });

        socketInstance.on(PENALTY_EVENTS.PRESENCE, (payload: SocketResponse<{ gameId: string; playerStatuses: Record<string, { isConnected: boolean }> }>) => {
            const { message, data } = payload;
            presenceCallbacks.current.forEach((cb) => cb(data));
            console.log('👥 PRESENCE:', message, data);
        });

        socketInstance.on(PENALTY_EVENTS.ERROR, (payload: SocketResponse<any>) => {
            const { message, data } = payload;
            toast.error(message || 'An error occurred');
            console.error('❌ Penalty game error:', message, data);
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.close();
        };
    }, [accessToken]);

    // --- Actions (fire & forget emits) ---
    const joinGame = useCallback(() => {
        if (!socket || !isConnected) return;
        socket.emit(PENALTY_EVENTS.JOIN_GAME, { gameId: game.id });
    }, [socket, isConnected, game.id]);

    const leaveGame = useCallback(() => {
        if (!socket || !isConnected) return;
        socket.emit(PENALTY_EVENTS.LEAVE_GAME, { gameId: game.id });
    }, [socket, isConnected, game.id]);

    const initGame = useCallback((shooter: User, goalkeeper: User) => {
        if (!socket || !isConnected) return;

        console.log("\n\n\n BEFORE EMITTING THE EVENT: ", {
            shooter, goalkeeper
        })

        socket.emit(PENALTY_EVENTS.INIT, { gameId: game.id, shooter, goalkeeper });
    }, [socket, isConnected, game.id]);

    const makeMove = useCallback(
        (direction: PenaltyGameDirection) => {
            if (!socket || !isConnected) return;
            socket.emit(PENALTY_EVENTS.MAKE_MOVE, {
                gameId: game.id,
                playerId: currentUserId,
                direction
            });
        },
        [socket, isConnected, game.id, currentUserId],
    );

    // --- Subscription helpers ---
    const onGameUpdate = useCallback((callback: GameUpdateCallback) => {
        gameUpdateCallbacks.current.push(callback);
        return () => {
            gameUpdateCallbacks.current = gameUpdateCallbacks.current.filter((cb) => cb !== callback);
        };
    }, []);

    const onGameInit = useCallback((callback: GameInitCallback) => {
        gameInitCallbacks.current.push(callback);
        return () => {
            gameInitCallbacks.current = gameInitCallbacks.current.filter((cb) => cb !== callback);
        };
    }, []);

    const onGameFinished = useCallback((callback: GameFinishedCallback) => {
        gameFinishedCallbacks.current.push(callback);
        return () => {
            gameFinishedCallbacks.current = gameFinishedCallbacks.current.filter((cb) => cb !== callback);
        };
    }, []);

    const onPresence = useCallback((callback: PresenceCallback) => {
        presenceCallbacks.current.push(callback);
        return () => {
            presenceCallbacks.current = presenceCallbacks.current.filter((cb) => cb !== callback);
        };
    }, []);

    return (
        <PenaltyGameContext.Provider
            value={{
                socket,
                isConnected,
                isError,
                error,
                game,
                gameState,
                setGameState,
                joinGame,
                leaveGame,
                initGame,
                makeMove,
                onGameInit,
                onGameUpdate,
                onGameFinished,
                onPresence,
            }}
        >
            {children}
        </PenaltyGameContext.Provider>
    );
};
