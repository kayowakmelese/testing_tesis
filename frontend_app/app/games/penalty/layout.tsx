'use client'
import { PenaltySocketProvider } from '@/contexts/PenaltySocketProvider'
import { useGetAccessToken } from '@/stores/auth.store'
import { GAME_TYPE } from '@/types'
import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode
}

const GameLayout = ({ children }: Props) => {
    const accessToken = useGetAccessToken()
    return (
        <>
            <PenaltySocketProvider accessToken={accessToken}>
                {children}
            </PenaltySocketProvider>
        </>
    )
}

export default GameLayout