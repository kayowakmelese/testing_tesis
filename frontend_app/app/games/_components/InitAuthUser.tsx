'use client'

import { useSetAccessToken, useSetAuthUser, useSetUserDetail } from '@/stores/auth.store'
import { User, UserDetail } from '@/types'
import { useLayoutEffect } from 'react'

const InitAuthUser = ({ user, accessToken, userDetail }: { user: User, accessToken: string, userDetail: UserDetail }) => {
    const setAuthUser = useSetAuthUser()
    const setAccessToken = useSetAccessToken()
    const setUserDetail = useSetUserDetail()

    useLayoutEffect(() => {
        setAuthUser(user)
        setAccessToken(accessToken)
        setUserDetail(userDetail)
    }, [])

    return null
}

export default InitAuthUser