'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Check, UserPlus, Coins } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { GAME_TYPE, GameConfig, User } from '@/types'
import { useActiveUsers } from '@/stores/active-users.store'
import { useGameInviteSocket } from '@/contexts/GameInviteSocketProvider'
import { toast } from 'sonner'

type Props = {
  users: User[]
  gameType: GAME_TYPE
  gameConfig: GameConfig
}
const GameInviteForm = ({ users, gameType, gameConfig }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<User[]>([])
  const [isFreeGame, setIsFreeGame] = useState(true)
  const [bet, setBet] = useState(gameConfig.serviceCharge > 0 ? gameConfig.serviceCharge : 10)
  const activeUsersId = useActiveUsers()
  const { createInvite } = useGameInviteSocket()

  // Filter users by search term
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      user.id !== '' // Exclude current user if needed
    )
  }, [users, searchTerm])

  const isUserActive = (userId: string) => activeUsersId.includes(userId)

  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev =>
      prev.some(u => u.id === user.id)
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user]
    )
  }

  // Validate form requirements
  const isFormValid = selectedUsers.length > 0 &&
    (!isFreeGame ? bet > 0 : true) &&
    selectedUsers.length + 1 <= gameConfig.maxPlayers

  const handleCreateInvite = () => {
    if (!isFormValid) return

    const toUsersId = selectedUsers.map(user => user.id)
    createInvite({
      toUsersId,
      gameType,
      bet: isFreeGame ? 0 : bet,
      minPlayers: 2
    })

    setSelectedUsers([])
  }

  // Reset bet when switching to free game
  useEffect(() => {
    if (isFreeGame) {
      setBet(0)
    } else if (bet === 0) {
      setBet(gameConfig.serviceCharge > 0 ? gameConfig.serviceCharge : 10)
    }
  }, [isFreeGame, gameConfig.serviceCharge])

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Invite Players</CardTitle>
        <CardDescription>Create a {gameType.toLowerCase()} match</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Game Type & Bet Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="free-game" className="font-medium">
              Free Game
            </Label>
            <Switch
              id="free-game"
              checked={isFreeGame}
              onCheckedChange={setIsFreeGame}
            />
          </div>

          {!isFreeGame && (
            <div className="space-y-2">
              <Label htmlFor="bet-amount" className="flex items-center gap-2">
                <Coins className="h-4 w-4" />
                Bet Amount (ETB)
              </Label>
              <Input
                id="bet-amount"
                type="number"
                min="0"
                step="1"
                value={bet}
                onChange={(e) => setBet(Math.max(0, Number(e.target.value)))}
                className="max-w-32"
                disabled={isFreeGame}
              />
              <p className="text-xs text-muted-foreground">
                Service fee: {gameConfig.serviceCharge} ETB
              </p>
            </div>
          )}
        </div>

        {/* Search & User Selection */}
        <div className="space-y-4">
          <div className="relative">
            <Input
              placeholder="Search players by name or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {selectedUsers.length} of {filteredUsers.length} players selected
            </p>
            <Button
              size="sm"
              onClick={handleCreateInvite}
              disabled={!isFormValid}
              className="gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Create Invite
            </Button>
          </div>

          <ScrollArea className="h-80 rounded-md border">
            {filteredUsers.length === 0 ? (
              <div className="flex h-full items-center justify-center py-6 text-muted-foreground">
                <p className="text-sm">No players found</p>
              </div>
            ) : (
              <div className="p-2">
                <div className="space-y-2">
                  {filteredUsers.map((user) => {
                    const isActive = isUserActive(user.id)
                    const isSelected = selectedUsers.some(u => u.id === user.id)

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${isSelected
                          ? 'border-primary bg-primary/10'
                          : 'border-transparent hover:bg-muted'
                          }`}
                        onClick={() => toggleUserSelection(user)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photoUrl || undefined} alt={user.username} />
                            <AvatarFallback>
                              {user.username?.charAt(0).toUpperCase() ||
                                user.firstName?.charAt(0).toUpperCase() ||
                                '?'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {user.username || `${user.firstName} ${user.lastName}`.trim() || 'Anonymous'}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                                {isActive ? '🟢 Online' : '⚫ Offline'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isSelected && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                          {!isActive && (
                            <Badge variant="outline" className="text-xs">
                              Offline
                            </Badge>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Validation Feedback */}
        {!isFormValid && selectedUsers.length > 0 && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            ⚠️
            {selectedUsers.length + 1 > gameConfig.maxPlayers
              ? `Max ${gameConfig.maxPlayers} players allowed`
              : !isFreeGame && bet <= 0
                ? "Bet amount must be greater than 0"
                : ""}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default GameInviteForm