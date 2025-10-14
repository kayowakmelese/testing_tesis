'use client'

import { ENV } from '@/config/env'
import { useActiveUsersActions } from '@/stores/active-users.store'
import { useAddSocket, useUpdateConnectionStatus } from '@/stores/websocket.store'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

interface RootSocketProviderProps {
  userId: string
  accessToken: string
  children: ReactNode
}

export function RootSocketProvider({
  userId,
  accessToken,
  children,
}: RootSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const namespace = '/'

  // 👇 GET ACTIVE USERS ACTIONS
  const { initActiveUsersId, addActiveUserId, removeActiveUserId } = useActiveUsersActions()

  const addSocket = useAddSocket()
  const updateConnectionStatus = useUpdateConnectionStatus()

  useEffect(() => {
    const wsUrl = ENV.NEXT_PUBLIC_WS_URL
    console.log({ wsUrl })

    const socketInstance = io(wsUrl + namespace, {
      auth: {
        token: accessToken
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket", "polling"],
    })

    addSocket(namespace, socketInstance)

    socketInstance.on('connect', () => {
      updateConnectionStatus(namespace, true)
      console.log('✅ You connected to Root:', socketInstance.id)
      setIsConnected(true)
      // toast.success('✅ You are connected to Root', { id: 'ws-connection' })

      // 👇 Request active users on connect
      socketInstance.emit("get-active-users")
    })

    socketInstance.on('welcome', (data) => {
      console.log('📬 Welcome:', data)
      toast.success(`👋 Welcome ${data.user?.username || 'Player'}!`, {
        id: 'welcome',
        duration: 3000,
      })
    })

    // 👇 NEW USER JOINED → ADD TO ACTIVE USERS
    socketInstance.on('new_user_connected', (data) => {
      console.log('🟢 New user connected:', data)
      if (data.user?.id && data.user.id !== userId) {
        addActiveUserId(data.user.id) // 👈 ADD TO STORE
        // toast.info(`🟢 ${data.user?.username || 'A player'} joined the game!`, {
        //   id: `new-user-${data.clientId}`,
        //   duration: 3000,
        // })
      }
    })

    // 👇 USER LEFT → REMOVE FROM ACTIVE USERS
    socketInstance.on('user_disconnected', (data) => {
      console.log('🔴 User disconnected:', data)
      if (data.user?.id && data.user.id !== userId) {
        removeActiveUserId(data.user.id) // 👈 REMOVE FROM STORE
        // toast.warning(`🔴 ${data.user?.username || 'A player'} left the game.`, {
        //   id: `user-disconnected-${data.clientId}`,
        //   duration: 3000,
        // })
      }
    })

    // 👇 INITIAL ACTIVE USERS LIST
    socketInstance.on("active-users", (usersId: string[]) => {
      console.log('Intialized active users:', usersId)
      initActiveUsersId(usersId) // 👈 INITIALIZE STORE
    })

    socketInstance.on('disconnect', () => {
      updateConnectionStatus(namespace, false)
      console.log('🔴 YOU disconnected')
      setIsConnected(false)
      toast.error('⚠️ You lost connection. Reconnecting...', {
        id: 'ws-connection',
        duration: 5000,
      })
    })

    socketInstance.on('connect_error', (err) => {
      updateConnectionStatus("/", false)
      console.error('WebSocket connection error:', err.message)
      toast.error(`❌ Connection error: ${err.message}`)
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.close()
    }
  }, [userId, accessToken, initActiveUsersId, addActiveUserId, removeActiveUserId])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useRootSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useRootSocket must be used within RootSocketProvider')
  }
  return context
}