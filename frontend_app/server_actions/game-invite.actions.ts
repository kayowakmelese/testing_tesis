'use server'

import axiosClient from "@/lib/axios-client";
import { serverActionWrapper } from ".";
import { GameInvite, GameInviteWithGame } from "@/types";

export const getUserGameInvites = async () => serverActionWrapper(async () => {
    const response = await axiosClient.get<(GameInviteWithGame)[]>("/game-invites/received")
    return response.data
})

export const getGameInviteDetail = async (gameId: string) => serverActionWrapper(async () => {
    const response = await axiosClient.get<GameInvite>(`/game-invites/${gameId}`)
    return response.data
})



