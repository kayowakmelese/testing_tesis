// components/websocket/ConnectionStatus.tsx
'use client'

import { Badge } from "@/components/ui/badge"
import { useWebSocketStore } from "@/stores/websocket.store"



export const ConnectionStatus = ({ namespace = '/' }: { namespace?: string }) => {
  const connection = useWebSocketStore(state => state.connections[namespace])
  
  if (!connection) {
    return <Badge variant="outline">❓ Unknown</Badge>
  }

  if (connection.isConnected) {
    return <Badge>🟢 Connected</Badge>
  }

  if (connection.isConnecting) {
    return <Badge variant="secondary">🟡 Connecting...</Badge>
  }

  return <Badge variant="destructive">🔴 Disconnected</Badge>
}

export const GlobalConnectionStatus = () => {
  const connections = useWebSocketStore(state => state.getAllConnections())
  const connectedNamespaces = Object.keys(connections).filter(
    ns => connections[ns]?.isConnected
  )

  return (
    <div className="flex items-center gap-2">
      <Badge variant={connectedNamespaces.length > 0 ? "default" : "secondary"}>
        🌐 {connectedNamespaces.length} connections
      </Badge>
      {connectedNamespaces.map(ns => (
        <Badge key={ns} variant="outline" className="text-xs">
          {ns === '/' ? 'root' : ns.replace('/', '')}
        </Badge>
      ))}
    </div>
  )
}