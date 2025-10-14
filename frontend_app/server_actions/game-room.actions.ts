'use server'

import axiosClient from "@/lib/axios-client"
import { serverActionWrapper } from "."
import { Game, GameConfig } from "@/types"

export const getGameRoom = async (gameId: string) => serverActionWrapper(async () => {
    const response = await axiosClient.get<Game & { config: GameConfig }>(`/games/rooms/${gameId}`)
    return response.data
})