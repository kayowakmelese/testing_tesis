// app/game/[gameId]/page.tsx

import { getGameRoom } from '@/server_actions/game-room.actions'
import { notFound } from 'next/navigation'
import ErrorDisplay from '@/components/custom/ErrorDisplay'
import { GameRoomClient } from '../_components/GameRoomClient'

type Props = {
    params: Promise<{ gameId: string }>
}

export default async function GameRoomPage({ params }: Props) {
    const { gameId } = await params
    const gameRoomResponse = await getGameRoom(gameId)

    if (!gameRoomResponse.success) {
        return <ErrorDisplay message={gameRoomResponse.error} />
    }

    const gameRoom = gameRoomResponse.data
    if (!gameRoom) return notFound()

    return <GameRoomClient initialGameRoom={gameRoom} />
}