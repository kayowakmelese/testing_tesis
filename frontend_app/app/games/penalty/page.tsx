import ErrorDisplay from '@/components/custom/ErrorDisplay'
import { getGameConfigByGameType } from '@/server_actions/game.actions'
import { GAME_TYPE, INVITE_STATUS } from '@/types'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


import { getAllUsers } from '@/server_actions/dev.actions'
import { getUserGameInvites } from '@/server_actions/game-invite.actions'
import DebugJson from '@/components/custom/DebugJson'
import GameInviteForm from '../_components/GameInviteForm'
import GameInvitesList from '../_components/GameInvitesList'


const GameSpace = async () => {
  const gameType = GAME_TYPE.PENALTY
  const response = await getGameConfigByGameType(gameType)

  const usersRes = await getAllUsers()

  const userInvitesRes = await getUserGameInvites()

  if (!userInvitesRes.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={userInvitesRes.error} />
      </div>)
  }

  if (!response.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={response.error} />
      </div>
    )
  }

  if (!usersRes.success) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorDisplay message={usersRes.error} />
      </div>
    )
  }

  const gameConfig = response.data
  const users = usersRes.data

  const userInvites = userInvitesRes.data

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Game Config Card */}
      {/* <DebugJson data={{ userInvites }} /> */}
      <Card className="shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {gameConfig.gameType} Game
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Game settings and details
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-muted-foreground">Players</p>
            <p className="text-lg font-semibold">
              {gameConfig.minPlayers} - {gameConfig.maxPlayers}
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Service Charge</p>
            <p className="text-lg font-semibold text-green-600">
              {gameConfig.serviceCharge}%
            </p>
          </div>
          <div>
            <p className="font-medium text-muted-foreground">Status</p>
            <p className="text-lg font-semibold">
              {gameConfig.isActive ? '🟢 Active' : '🔴 Inactive'}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Active Users + Search */}
        <GameInviteForm users={users} gameType={gameType} gameConfig={gameConfig} />
        <GameInvitesList initialInvites={userInvites}  />
      </div>
    </main>
  )
}

export default GameSpace