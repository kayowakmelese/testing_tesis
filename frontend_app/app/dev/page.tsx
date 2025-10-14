import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'


import { getAllUsersForDev } from '@/server_actions/dev.actions'
import React from 'react'
import LoginForm from './_components/LoginForm'
import { User } from '@/types'

const DevPage = async () => {
    const response = await getAllUsersForDev()
    if (!response.success) {
        return <Alert>{response.error}</Alert>
    }

    const users = response.data

    return (
        <main className='px-6 lg:px-8 py-6'>
            <Badge className='mb-6'>Dev's Only</Badge>

            <section className='mb-4'>
                <LoginForm />
            </section>

            <section>
                {users.length === 0 ? "NO USERS FOUND" : <UsersList users={users} />}
            </section>
        </main>
    )
}

type UsersListProps = {
    users: User[]
}

const UsersList = ({ users }: UsersListProps) => {
    return <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4'>{users.map(u =>
        <Card key={u.id} className='rounded-none shadow-none'>
            <CardHeader >
                <CardTitle>{u.username}</CardTitle>
                <CardDescription>#{u.telegramId}</CardDescription>
            </CardHeader>
        </Card>)}
    </div>

}

export default DevPage