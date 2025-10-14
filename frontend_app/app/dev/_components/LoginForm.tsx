"use client"

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getUserByTelegramId, loginByTelegramId } from '@/server_actions/dev.actions'
import { useSetAuthUser } from '@/stores/auth.store'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useTransition } from 'react'
import { toast } from 'sonner'

const LoginForm = () => {
    const [pending, startTnx] = useTransition()
    const router = useRouter()

    const setAuthUser = useSetAuthUser()
    return (
        <form className='flex items-center gap-2' onSubmit={async (ev) => {
            ev.preventDefault()
            const telegramId = new FormData(ev.currentTarget).get("telegramId") as string

            if (!telegramId) {
                toast.error("Telegram Id is required.")
                return;
            }

            startTnx(async () => {
                const response = await getUserByTelegramId(telegramId)

                if (!response.success) {
                    toast.error(response.error)
                    return;
                }

                const user = response.data

                // Login
                const cred = await loginByTelegramId(user.telegramId)

                if (!cred.success) {
                    toast.error(cred.error)
                    return;
                }

                const { data } = cred
                toast.success("Welcome back.")
                setAuthUser(data.user)
                router.replace("/")
            })
        }}>
            <Input placeholder='Telegram Id' name='telegramId' className='h-12' />
            <Button pending={pending} type='submit' className='h-12'>Login</Button>
        </form>
    )
}

export default LoginForm