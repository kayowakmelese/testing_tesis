'use client'
import { create } from 'zustand'
import { Socket } from 'socket.io-client'

interface ConnectionState {
  isConnected: boolean
  isConnecting: boolean
  lastActivity?: Date
}

type Namespace = string

interface WebSocketState {
  sockets: Record<Namespace, Socket | null>
  connections: Record<Namespace, ConnectionState>
  errors: Record<Namespace, string | null>

  // Actions
  addSocket: (namespace: Namespace, socket: Socket) => void
  removeSocket: (namespace: Namespace) => void
  updateConnectionStatus: (namespace: Namespace, isConnected: boolean) => void
  setError: (namespace: Namespace, error: string | null) => void
  clearError: (namespace: Namespace) => void
  getConnectionStatus: (namespace: Namespace) => ConnectionState
  getAllConnections: () => Record<Namespace, ConnectionState>
  disconnectAll: () => void

  // Socket operations
  emit: (namespace: Namespace, event: string, data?: any) => void
  getSocket: (namespace: Namespace) => Socket | null
}

export const webSocketStore = create<WebSocketState>((set, get) => ({
  sockets: {},
  connections: {},
  errors: {},

  addSocket: (namespace: Namespace, socket: Socket) => {
    set((state) => ({
      sockets: { ...state.sockets, [namespace]: socket },
      connections: {
        ...state.connections,
        [namespace]: { isConnected: false, isConnecting: true, lastActivity: new Date() }
      },
      errors: { ...state.errors, [namespace]: null }
    }))
  },

  removeSocket: (namespace: Namespace) => {
    set((state) => {
      const newSockets = { ...state.sockets }
      const newConnections = { ...state.connections }
      const newErrors = { ...state.errors }

      delete newSockets[namespace]
      delete newConnections[namespace]
      delete newErrors[namespace]

      return { sockets: newSockets, connections: newConnections, errors: newErrors }
    })
  },

  updateConnectionStatus: (namespace: Namespace, isConnected: boolean) => {
    set((state) => ({
      connections: {
        ...state.connections,
        [namespace]: {
          isConnected,
          isConnecting: false,
          lastActivity: new Date()
        }
      },
      errors: {
        ...state.errors,
        [namespace]: isConnected ? null : state.errors[namespace]
      }
    }))
  },

  setError: (namespace: Namespace, error: string | null) => {
    set((state) => ({
      errors: { ...state.errors, [namespace]: error },
      connections: {
        ...state.connections,
        [namespace]: {
          ...state.connections[namespace],
          isConnecting: false
        }
      }
    }))
  },

  clearError: (namespace: Namespace) => {
    set((state) => ({
      errors: { ...state.errors, [namespace]: null }
    }))
  },

  getConnectionStatus: (namespace: Namespace) => {
    return get().connections[namespace] || { isConnected: false, isConnecting: false }
  },

  getAllConnections: () => {
    return get().connections
  },

  disconnectAll: () => {
    const { sockets } = get()
    Object.values(sockets).forEach(socket => {
      if (socket) socket.disconnect()
    })

    set({
      sockets: {},
      connections: {},
      errors: {}
    })
  },

  // New socket operations
  emit: (namespace: Namespace, event: string, data?: any) => {
    const socket = get().sockets[namespace]
    if (socket?.connected) {
      socket.emit(event, data)
    } else {
      console.warn(`Cannot emit ${event}: Socket not connected to ${namespace}`)
    }
  },

  getSocket: (namespace: Namespace) => {
    return get().sockets[namespace] || null
  }
}))



export const useSockets = () => webSocketStore(s => s.sockets)

export const useConnections = () => webSocketStore(s => s.connections)
export const useErrors = () => webSocketStore(s => s.errors)
export const useAddSocket = () => webSocketStore.getState().addSocket
export const useRemoveSocket = () => webSocketStore.getState().removeSocket
export const useUpdateConnectionStatus = () => webSocketStore.getState().updateConnectionStatus

export const useSetError = () => webSocketStore.getState().setError
export const useClearError = () => webSocketStore.getState().clearError