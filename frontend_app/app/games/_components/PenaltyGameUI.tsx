'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PenaltyGameDirection, usePenaltyGame } from '../_contexts/PenaltyGameContext'
import { GamePlayer } from '@/types'
import { useAuthUser } from '@/stores/auth.store'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PenaltyGameState } from '@/types/penalty-game'
import { toast } from 'sonner'
import { RotateCcw, Trophy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import DebugJson from '@/components/custom/DebugJson'
import { cn } from '@/lib/utils'

const PenaltyGameUI = () => {
    const authUser = useAuthUser()
    const [isGameFinished, setIsGameFinished] = useState(false)
    const {
        isConnected,
        joinGame,
        onPresence,
        leaveGame,
        initGame,
        gameState,
        game,
        onGameUpdate,
        makeMove,
        onGameFinished,
        setGameState,
        onGameInit
    } = usePenaltyGame()

    const [playerStatuses, setPlayerStatuses] = React.useState<Record<string, { isConnected: boolean }>>({})
    const router = useRouter()
    const [shooter, setShooter] = useState<GamePlayer | null>(null)
    const [goalkeeper, setGoalkeeper] = useState<GamePlayer | null>(null)


    useEffect(() => {
        if (shooter && goalkeeper) return;

        const shooterPlayer = game.players.find(p => p.role === 'shooter')
        const goalkeeperPlayer = game.players.find(p => p.role === 'goalkeeper')

        if (shooterPlayer) setShooter(shooterPlayer)
        if (goalkeeperPlayer) setGoalkeeper(goalkeeperPlayer)
    }, [game.players])


    const decidePlayersRoleRandomly = useCallback(() => {
        const shooterIndex = Math.random() > 0.5 ? 0 : 1
        const goalkeeperIndex = shooterIndex === 0 ? 1 : 0

        return {
            shooter: game.players[shooterIndex],
            goalkeeper: game.players[goalkeeperIndex]
        }
    }, [game.players])

    // Check if all players are connected
    const allPlayersConnected = useMemo(() => game.players.every(p => playerStatuses[p.user.id]?.isConnected), [game.players, playerStatuses])

    // Initialize game when all players are connected
    useEffect(() => {
        const unsub = onGameInit((data) => {
            console.log("\n\n\nGAME INITIALIZED VIA SOCKET:", data)
            setShooter(data.players.find(p => p.role === 'shooter') || null)
            setGoalkeeper(data.players.find(p => p.role === 'goalkeeper') || null)
            setGameState(data.state as PenaltyGameState)
        })

        if (allPlayersConnected && !shooter && !goalkeeper) {
            console.log("\n\n\ninitialized\n\n\n")
            const { shooter, goalkeeper } = decidePlayersRoleRandomly()
            toast.info(shooter.user.username + " is selected as a shooter by coin flip.")
            console.log("Initializing game with", { shooter, goalkeeper })
            initGame(shooter.user, goalkeeper.user)
        }

        return () => {
            unsub()
        }

    }, [allPlayersConnected, shooter, goalkeeper, decidePlayersRoleRandomly])

    // Setup game listeners
    useEffect(() => {
        joinGame()

        const unsubPresence = onPresence((data) => {
            console.log('PRESENCE UPDATE:', data)
            setPlayerStatuses(data.playerStatuses)
        })

        const unsubGameUpdate = onGameUpdate((data) => {
            console.log('Game update !!!!!:', { data })
            // setGameState(data.state)
        })

        return () => {
            unsubPresence()
            unsubGameUpdate()
        }
    }, [isConnected])

    // Cleanup on unmount
    useEffect(() => {
        return () => leaveGame()
    }, [])

    useEffect(() => {
        onGameFinished((data) => {
            console.log("ON GAME FINISHED", data)
            toast.success('Game finished!')
            setIsGameFinished(true)
        })
        return () => leaveGame()
    }, [])

    useEffect(() => {
        if (game.state && !gameState) {
            setGameState(game.state as PenaltyGameState)
        }
    }, [game.state, gameState])

    const makeMoveHandler = (direction: PenaltyGameDirection) => {
        makeMove(direction)
    }

    // Determine current turn
    const isShooterTurn = gameState?.turn === 'shooter'
    const currentPlayer = isShooterTurn ? shooter : goalkeeper
    const isCurrentUserTurn = currentPlayer?.user.id === authUser.id

    const winnerUser = useMemo(() => {
        if (gameState && gameState.status === 'FINISHED') {
            const winner = game.players.find(p => p.id === gameState.winnerId)
            return winner?.user || null
        }
        return null
    }, [gameState])

    // Game finished state
    if (isGameFinished || gameState && gameState?.status === 'FINISHED') {
        return (
            <div className="max-w-md mx-auto p-4 space-y-6">
                <DebugJson data={{
                    game
                }} />
                <Card className="border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50">
                    {/* <DebugJson data={{ gameState, gs: game.state, currentPlayer, allPlayersConnected, shooter, goalkeeper }} /> */}
                    <CardHeader className="text-center pb-2">
                        <div className="flex justify-center mb-3">
                            <Trophy className="h-12 w-12 text-yellow-500" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-yellow-700">Game Finished!</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center py-4">
                            <div className="text-sm text-muted-foreground mb-2">Winner</div>
                            {/* <DebugJson data={{
                                winnerUser
                            }} /> */}
                            {winnerUser ? (
                                <div className="flex flex-col items-center">
                                    <Avatar className="h-20 w-20 mb-3">
                                        {/* <AvatarImage src={winnerUser.photoUrl} /> */}
                                        <AvatarFallback className="text-2xl">
                                            {winnerUser.username.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="text-2xl font-bold">{winnerUser.username}</div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {winnerUser.firstName} {winnerUser.lastName}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xl font-bold">Unknown Winner</div>
                            )}
                        </div>

                        {/* Final Score */}
                        <div className="bg-secondary rounded-lg p-4">
                            <div className="text-center text-sm text-muted-foreground mb-2">Final Score</div>
                            <div className="flex justify-center items-baseline gap-4 text-3xl font-bold">
                                <span>{gameState?.score.shooter || 0}</span>
                                <span className="text-muted-foreground">-</span>
                                <span>{gameState?.score.goalkeeper || 0}</span>
                            </div>
                        </div>

                        {/* Player Roles */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <Badge variant="secondary" className="mb-2">Shooter</Badge>
                                <div className="font-medium">{shooter?.user.username}</div>
                            </div>
                            <div className="text-center">
                                <Badge variant="secondary" className="mb-2">Goalkeeper</Badge>
                                <div className="font-medium">{goalkeeper?.user.username}</div>
                            </div>
                        </div>

                        {/* Restart Button */}
                        <Button
                            className="w-full mt-2"
                            onClick={() => {
                                router.push('/games/penalty')
                            }}
                        >
                            <RotateCcw className="mr-2 h-4 w-4" />
                            Play Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto p-4 space-y-6">
            {/* Game Status */}
            {/* <DebugJson data={{ gameState: game.state, players: game.players }} /> */}
            <Card className='shadow-none'>
                <CardHeader>
                    <CardTitle className="text-center">Penalty Shootout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Round and Score */}
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="text-sm text-muted-foreground">Round</span>
                            <div className="text-xl font-bold">{gameState?.round}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-muted-foreground">Score</div>
                            <div className="flex gap-4 justify-center">

                                <span className='font-bold'>
                                    <span className='text-xs font-light'>
                                        S
                                    </span>
                                    {gameState?.score.shooter}</span>
                                <span>-</span>
                                <span className='font-bold'>
                                    <span className='text-xs font-light'>G</span>{gameState?.score.goalkeeper}</span>
                            </div>
                        </div>
                    </div>

                    {/* Turn Indicator */}
                    <div className="pt-2">
                        <div className="text-sm text-muted-foreground mb-1">
                            {isShooterTurn ? 'Shooter' : 'Goalkeeper'}'s Turn
                        </div>
                        {currentPlayer && (
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={currentPlayer.user.photoUrl} />
                                    <AvatarFallback>
                                        {currentPlayer.user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">{currentPlayer.user.username}</div>
                                    {isCurrentUserTurn && (
                                        <Badge variant="secondary" className="mt-1">Your Turn</Badge>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Player Roles */}
            <div className="grid grid-cols-2 gap-4">
                {/* Shooter */}
                <Card className={cn("shadow-none", {
                    "ring-4 ring-primary": shooter?.user.id === authUser.id
                })}>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Badge variant="outline" className="mb-2">Shooter</Badge>
                            <Avatar className="mx-auto mb-2">
                                <AvatarImage src={shooter?.user.photoUrl} />
                                <AvatarFallback>
                                    {shooter?.user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{shooter?.user.username}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {playerStatuses[shooter?.user.id || ""]?.isConnected ? (
                                    <span className="text-green-500">Online</span>
                                ) : (
                                    <span className="text-red-500">Offline</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Goalkeeper */}
                <Card className={cn("shadow-none", {
                    "ring-4 ring-primary": goalkeeper?.user.id === authUser.id
                })}>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <Badge variant="outline" className="mb-2">Goalkeeper</Badge>
                            <Avatar className="mx-auto mb-2">
                                <AvatarImage src={goalkeeper?.user.photoUrl} />
                                <AvatarFallback>
                                    {goalkeeper?.user.username.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{goalkeeper?.user.username}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                                {playerStatuses[goalkeeper?.user.id || ""]?.isConnected ? (
                                    <span className="text-green-500">Online</span>
                                ) : (
                                    <span className="text-red-500">Offline</span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Action Button (for current player) */}
            {isCurrentUserTurn && !isGameFinished && (
                <div className='flex gap-3'>
                    <Button className='flex-1' onClick={() => {
                        // TODO: Implement actual move logic
                        console.log('Make move LEFT')
                        makeMoveHandler("left")
                    }}>
                        {isShooterTurn ? 'Left Shot' : 'Dive Left'}
                    </Button>
                    <Button className='flex-1' onClick={() => {
                        // TODO: Implement actual move logic
                        console.log('Make move CENTER')
                        makeMoveHandler("center")
                    }}>
                        {isShooterTurn ? 'Center Shot' : 'Dive Center'}
                    </Button>
                    <Button className='flex-1' onClick={() => {
                        // TODO: Implement actual move logic
                        console.log('Make move RIGHT')
                        makeMoveHandler("right")
                    }}>
                        {isShooterTurn ? 'Right Shot' : 'Dive Right'}
                    </Button>

                </div>
            )}
        </div>
    )
}

export default PenaltyGameUI