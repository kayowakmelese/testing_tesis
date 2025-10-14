'use client'

import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'sonner'

export default function TestSocketPage() {
  useEffect(() => {
    console.log('🧪 Starting manual socket test...')

    const socket = io('http://localhost:3000', {
      timeout: 10000,
      reconnection: true, // Disable for test
      transports: ["websocket", "polling"],
    })

    socket.on('connect', () => {
      console.log('✅ MANUAL TEST: Connected!', socket.id)
      toast.success('Connected!')
    })

    socket.on('connect_error', (err) => {
      console.error('❌ MANUAL TEST: Connection Error:', err.message)
      toast.error('Connection failed: ' + err.message)
    })

    socket.on('error', (err) => {
      console.error('❌ MANUAL TEST: General Error:', err)
      toast.error(err.message)
    })

    return () => {
      socket.close()
    }
  }, [])

  return (
    <div className="p-8">
      <h1>Socket.IO Test</h1>
      <p>Check browser console for connection status.</p>
    </div>
  )
}