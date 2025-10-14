'use client'

import React from 'react'
import SocketStatusBadge from './SocketStatusBadge'
import { useAuthUser, useGetUserDetail } from '@/stores/auth.store'

const Header = () => {
    const authUser = useAuthUser()
    const userDetail = useGetUserDetail()
    return (
        <div className="border-b bg-background/50 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between py-3 px-4">
                <h1 className="text-xl font-bold">🎮 Game Lobby</h1>
                {/* 👇 Clean, decoupled status badge */}

                <div className='flex gap-4'>
                    <div className='flex gap-1'>
                        <SocketStatusBadge />
                        <p className='font-bold'>{authUser.username}</p>
                    </div>
                    <p>
                        <span className='font-bold'>
                            {userDetail.wallet.balance}
                        </span>
                        <span className='font-light text-xs'>
                            ETB
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Header