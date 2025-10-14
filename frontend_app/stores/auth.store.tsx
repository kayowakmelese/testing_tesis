"use client"

import { User, UserDetail } from "@/types"
import { create } from "zustand"

type AuthState = {
    user: User
    userDetail: UserDetail
    accessToken: string
}

type AuthActions = {
    setUser: (u: User) => void
    setUserDetail: (d: UserDetail) => void
    setAccessToken: (ac: string) => void
}

const authStore = create<AuthState & AuthActions>()((set) => ({
    user: {
        id: '',
        firstName: '',
        telegramId: '',
        username: '',
    },
    userDetail: {
        id: '',
        firstName: '',
        telegramId: '',
        username: '',
        games: [],
        wallet: {
            id: '',
            balance: 0,
            currency: 'ETB',
            userId: '',
            createdAt: '',
            updatedAt: ''
        },
        userStatus: {
            isBanned: false,
            isSuspended: false,
            isVerified: false,
            createdAt: '',
            updatedAt: '',
            userId: '',
            warningCount: 5,

        }
    },
    accessToken: '',
    setUser(u) {
        set({ user: u })
    },
    setAccessToken(ac) {
        set({ accessToken: ac })
    },
    setUserDetail(d) {
        set({ userDetail: d })
    },
}))

export const useAuthUser = () => authStore(state => state.user)
export const useGetAccessToken = () => authStore(state => state.accessToken)
export const useGetUserDetail = () => authStore(state => state.userDetail)
export const useSetAuthUser = () => authStore(state => state.setUser)
export const useSetAccessToken = () => authStore(state => state.setAccessToken)
export const useSetUserDetail = () => authStore(s => s.setUserDetail)


