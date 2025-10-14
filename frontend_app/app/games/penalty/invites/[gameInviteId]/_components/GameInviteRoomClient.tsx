// app/game-invite/[gameInviteId]/GameInviteRoomClient.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, Circle, User, WifiOff, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';
import { GameInvite, PlayerPresenceStatus } from '@/types';
import { useAuthUser } from '@/stores/auth.store';
import { useGameInviteSocket } from '@/contexts/GameInviteSocketProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';


type Props = {
    gameInvite: GameInvite;
};

export default function GameInviteRoomClient({
    gameInvite,
}: Props) {
    const [playerStatuses, setPlayerStatuses] = useState<Record<string, PlayerPresenceStatus>>({});

    const authUser = useAuthUser()
    const currentUserId = authUser.id

    const router = useRouter()

    const { joinGameInviteRoom, onGameInviteRoomPresence, leaveGameInviteRoom, isConnected, updatePlayerReadyStatusGameInviteRoom, startGame, onGameStarted } = useGameInviteSocket()

    useEffect(() => {
        const unsubscribe = onGameInviteRoomPresence((data) => {
            console.log('🎮 PRESENCE UPDATE:', data);
            setPlayerStatuses(data.data.playerStatuses);
        });

        const unsubGameStarted = onGameStarted((payload) => {
            console.log({ payload })
            toast.success(payload.message)
            router.push(`/games/rooms/${payload.data.game.id}`)
        })

        joinGameInviteRoom(gameInvite.id);

        // ✅ 3. Cleanup: unsubscribe + optionally leave room
        return () => {
            unsubscribe();
            leaveGameInviteRoom(gameInvite.id);
            unsubGameStarted()
        };
    }, [gameInvite.id, isConnected]);


    const handleStartGame = () => {
        startGame(gameInvite.id)
    }

    const handleReady = () => {
        updatePlayerReadyStatusGameInviteRoom(gameInvite.id)
    };

    const allPlayers = [gameInvite.fromUser, ...gameInvite.toUsers];
    const allReady = allPlayers.every((user) => user && playerStatuses[user.id]?.isReady);

    const isCreator = currentUserId === gameInvite.fromUserId;

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <Card className='shadow-none '>
                <CardHeader>
                    <CardTitle>
                        {gameInvite.gameType} Game Invite
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>
                        <strong>Host:</strong> {gameInvite.fromUser?.username}
                    </p>
                    <p>
                        <strong>Bet:</strong> {gameInvite.bet} <span className='text-xs font-light'>ETB
                            </span>
                    </p>
                </CardContent>
            </Card>

            <Card className='shadow-none'>
                <CardHeader>
                    <CardTitle>Players ({allPlayers.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {allPlayers.map((user) => {
                        if (!user) {
                            return null
                        }

                        const status = playerStatuses[user.id] || { isConnected: false, isReady: false };
                        const isMe = user.id === currentUserId;

                        return (
                            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <Avatar>
                                        <AvatarImage src={user.photoUrl} />
                                        <AvatarFallback>
                                            <User className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {user.username}
                                            {isMe && <span className="text-xs text-muted-foreground ml-2">(You)</span>}
                                        </p>
                                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                                            {status.isConnected ? (
                                                <span className="flex items-center text-green-500">
                                                    <Wifi className="h-3 w-3 mr-1" /> Online
                                                </span>
                                            ) : (
                                                <span className="flex items-center text-muted-foreground">
                                                    <WifiOff className="h-3 w-3 mr-1" /> Offline
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    {status?.isReady ? (
                                        <Badge variant="success" className="flex items-center">
                                            <Check className="h-3 w-3 mr-1" /> Ready
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="flex items-center">
                                            <Circle className="h-3 w-3 mr-1" /> Not Ready
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Ready Button for non-creator */}
            {!playerStatuses[authUser.id]?.isReady && (
                <div className="text-center">
                    <Button onClick={handleReady} size="lg">
                        I'm Ready to Play!
                    </Button>
                </div>
            )}

            {/* Start Game Button (only for creator when all ready) */}
            {isCreator && allReady && (
                <div className="text-center">
                    <Button size="lg" variant="default" onClick={handleStartGame}>
                        🚀 Start Game
                    </Button>
                </div>
            )}

            {!isCreator && allReady && (
                <p className="text-center text-muted-foreground">
                    Waiting for the host to start the game...
                </p>
            )}

            {isCreator && !allReady && (
                <p className="text-center text-muted-foreground">
                    Waiting for all players to get ready...
                </p>
            )}
        </div>
    );
}