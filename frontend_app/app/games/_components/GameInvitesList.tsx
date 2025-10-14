'use client'

import DebugJson from '@/components/custom/DebugJson'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGameInviteSocket } from '@/contexts/GameInviteSocketProvider'
import { useAuthUser } from '@/stores/auth.store'
import { GAME_STATUS, GameInvite, GameInviteWithGame, INVITE_STATUS } from '@/types' // Import the actual Prisma enum
import { formatTimeAgo } from '@/utils/format'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  initialInvites: GameInviteWithGame[]
}

const GameInvitesList = ({ initialInvites }: Props) => {
  const [gameInvites, setGameInvites] = useState(initialInvites)
  const [filter, setFilter] = useState<'ALL' | INVITE_STATUS>('ALL')
  const authUser = useAuthUser()
  const router = useRouter()

  const {
    onInviteReceived,
    acceptInvite,
    onInviteAccepted,
    declineInvite,
    onInviteDeclined,
    cancelInvite,
    onInviteCanceled,
  } = useGameInviteSocket()

  const handleJoin = (gameInviteId: string) => {
    router.push(`/games/penalty/invites/${gameInviteId}`)
  }

  // Handle incoming invites
  useEffect(() => {
    const unsubscribe = onInviteReceived((data) => {
      toast.success('New game invite received')
      setGameInvites((prev) => [data.data as GameInviteWithGame, ...prev])
      console.log({ data })
    })
    return () => unsubscribe()
  }, [])

  // Handle accepted invites - REMOVE invite from list
  useEffect(() => {
    const unsubscribe = onInviteAccepted((data) => {
      toast.success(data.message)
      // update status
      setGameInvites((prev) =>
        prev.map((i) => i.id === data.data.gameInvite.id ? { ...i, status: INVITE_STATUS.ACCEPTED } : i)
      )
    })
    return () => unsubscribe()
  }, [])

  // Handle declined invites - REMOVE invite from list
  useEffect(() => {
    const unsubscribe = onInviteDeclined((payload) => {
      toast.info(payload.message)
      setGameInvites((prev) =>
        prev.map((i) => i.id === payload.data.gameInviteId ? { ...i, status: INVITE_STATUS.DECLINED } : i)
      )
    })
    return () => unsubscribe()
  }, [])

  // Handle canceled invites - REMOVE invite from list
  useEffect(() => {
    const unsubscribe = onInviteCanceled((payload) => {
      toast.info(payload.message)

      // Remove the invite since it's canceled
      setGameInvites((prev) =>
        prev.filter((i) => i.id !== payload.data.gameInviteId)
      )
    })
    return () => unsubscribe()
  }, [])

  const isSentByMe = (invite: GameInvite) => invite.fromUserId === authUser.id

  const getFirstRecipient = (invite: GameInvite) => {
    return invite.toUsers?.[0] || {
      id: '',
      username: 'Unknown',
      photoUrl: null,
    }
  }

  // Filter invites by status
  const filteredInvites =
    filter === 'ALL'
      ? gameInvites
      : gameInvites.filter((i) => i.status === filter)

  // Get badge variant based on status
  const getBadgeVariant = (status: INVITE_STATUS) => {
    switch (status) {
      case INVITE_STATUS.ACCEPTED:
        return 'success'
      case INVITE_STATUS.DECLINED:
        return 'destructive'
      case INVITE_STATUS.PENDING:
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <Card className="shadow-none">
      <DebugJson data={gameInvites} />
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Game Invites</CardTitle>
        <CardDescription className="text-sm">
          {filteredInvites.length
            ? 'Manage your game requests'
            : 'No invites available'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filter Tabs */}
        <Tabs value={filter} onValueChange={(val) => setFilter(val as any)}>
          <TabsList className="grid grid-cols-5 mb-3">
            <TabsTrigger value="ALL">All</TabsTrigger>
            <TabsTrigger value={INVITE_STATUS.PENDING}>Pending</TabsTrigger>
            <TabsTrigger value={INVITE_STATUS.ACCEPTED}>Accepted</TabsTrigger>
            <TabsTrigger value={INVITE_STATUS.DECLINED}>Declined</TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[50vh] rounded-md border">
          {filteredInvites.length === 0 ? (
            <div className="flex h-full items-center justify-center py-6 text-muted-foreground">
              <p className="text-sm">No invites in this category</p>
            </div>
          ) : (
            <div className="p-2 space-y-3">
              {filteredInvites.map((invite) => {
                const firstRecipient = getFirstRecipient(invite)
                const isMyInvite = isSentByMe(invite)

                return (
                  <div
                    key={invite.id}
                    className="rounded-lg border bg-card p-3 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={
                              isMyInvite
                                ? firstRecipient.photoUrl
                                : invite.fromUser?.photoUrl
                            }
                            alt={
                              isMyInvite
                                ? firstRecipient.username
                                : invite.fromUser?.username
                            }
                          />
                          <AvatarFallback>
                            {(
                              isMyInvite
                                ? firstRecipient.username
                                : invite.fromUser?.username
                            )?.charAt(0) || '?'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {isMyInvite
                              ? `Sent to ${firstRecipient.username}`
                              : `From ${invite.fromUser?.username}`}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {invite.gameType}
                            </span>
                            {invite.toUsers.length > 1 && (
                              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                                +{invite.toUsers.length - 1}
                              </Badge>
                            )}
                            <Badge
                              //   variant={getBadgeVariant(invite.status!)}
                              className="text-[10px] px-1.5 py-0.5 capitalize"
                            >
                              {invite.status.toLowerCase()}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTimeAgo(new Date(invite.createdAt))}
                      </span>
                    </div>

                    {invite.status === INVITE_STATUS.ACCEPTED && invite.game?.status !== GAME_STATUS.FINISHED &&
                      <div className="mt-3 flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleJoin(invite.id)}
                        >
                          Join
                        </Button>
                      </div>
                    }

                    {invite.status === INVITE_STATUS.ACCEPTED && invite.game?.status === GAME_STATUS.FINISHED &&
                      <div className="mt-3 flex justify-end gap-2">
                        <Badge variant={invite.game?.state?.winner === authUser.id ? "success" : "destructive"}>
                          {invite.game?.state?.winner === authUser.id ? "You Win" : "You Lost"}
                        </Badge>
                      </div>
                    }

                    {/* Actions only for PENDING */}
                    {invite.status === INVITE_STATUS.PENDING && (
                      <div className="mt-3 flex justify-end gap-2">
                        {isMyInvite ? (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => cancelInvite(invite.id)}
                          >
                            Cancel
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              onClick={() => acceptInvite(invite.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => declineInvite(invite.id)}
                            >
                              Decline
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

export default GameInvitesList