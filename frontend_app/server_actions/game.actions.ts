'use server'

import axiosClient from "@/lib/axios-client";
import { serverActionWrapper } from ".";
import { GAME_TYPE, GameConfig } from "@/types";

export const getGameConfigs = async () => serverActionWrapper(async () => {
    const response = await axiosClient.get<GameConfig[]>("/games")
    return response.data
})

export const getGameConfigByGameType = async (gameType: GAME_TYPE) => serverActionWrapper(async () => {
    const response = await axiosClient.get<GameConfig>(`/games/types/${gameType}`)
    return response.data
})