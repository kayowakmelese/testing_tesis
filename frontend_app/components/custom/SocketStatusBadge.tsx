'use client'

import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useRootSocket } from '@/contexts/RootSocketProvider'



export default function SocketStatusBadge() {
  const { isConnected } = useRootSocket()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span>
            {isConnected ? '🟢' : '🔴'}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isConnected ? 'Live invites enabled' : 'Reconnecting...'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}