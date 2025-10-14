"use server"
import axiosClient from "@/lib/axios-client"
import { serverActionWrapper } from "."
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { Tokens, User } from "@/types"
import { COOKIE_NAMES } from "@/constants"
import { ENV } from "@/config/env"


export const getAllUsers = async () => serverActionWrapper(async () => {
    const res = await axiosClient.get<User[]>("/users")
    const data = res.data
    return data
})

export const getAllUsersForDev = async () => serverActionWrapper(async () => {
    const res = await axiosClient.get<User[]>("/users/dev")
    const data = res.data
    return data
})

export const getUsers = async () => serverActionWrapper(async () => {
    const res = await axiosClient.get<User[]>("/users")
    const data = res.data
    return data
})

export const getUserByTelegramId = async (telegramId: string) => serverActionWrapper(async () => {
    const res = await axiosClient.get<User>(`/users/telegram/${telegramId}`)
    const data = res.data
    return data
})

export const loginByTelegramId = async (telegramId: string) => serverActionWrapper(async () => {
    const res = await axiosClient.get<{ user: User, tokens: Tokens }>(`/auth/telegram/${telegramId}/login`)
    const data = res.data

    await setTokens({
        accessToken: data.tokens.accessToken,
        refreshToken: data.tokens.refreshToken
    })
    revalidatePath("/", "layout")

    return data
})

const setTokens = async ({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) => {
    const cookie = await cookies()
    cookie.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })
    cookie.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
        httpOnly: true,
        secure: ENV.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
    })
}
