import axiosClient from "@/lib/axios-client";
import { serverActionWrapper } from ".";
import { Tokens, User, UserDetail } from "@/types";

export const verifyUser = async () => serverActionWrapper(async () => {
    const res = await axiosClient.get<User & Tokens['accessToken']>("/auth/verify")
    return res.data
})

export const getUserDetail = async (userId: string) => serverActionWrapper(async () => {
    const res = await axiosClient.get<UserDetail>(`/users/${userId}`)
    return res.data
})