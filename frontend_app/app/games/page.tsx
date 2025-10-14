import React from 'react'
import ErrorDisplay from '@/components/custom/ErrorDisplay'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getGameConfigs } from '@/server_actions/game.actions'
import { Users, CreditCard, PlayCircle, Activity } from 'lucide-react'
import Link from 'next/link'

const Games = async () => {
  const gameConfigs = await getGameConfigs()

  if (!gameConfigs.success) {
    return <ErrorDisplay message={gameConfigs.error} />
  }

  return (
    <main className="container mx-auto px-4 py-10">
      {/* Page header */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Choose a Game</h1>
        <p className="text-muted-foreground mt-2">
          Select a game configuration to start playing with others.
        </p>
      </div>

      {/* Empty state */}
      {gameConfigs.data.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="flex justify-center mb-4">
              <Activity className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Games Available</h3>
            <p className="text-muted-foreground">
              Please check back later when new games are available to play.
            </p>
          </CardContent>
        </Card>
      ) : (
        // Game cards
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameConfigs.data.map((gc) => (
            <Card
              key={gc.id}
              className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold">{gc.gameType}</CardTitle>
                    <CardDescription className="mt-1 text-sm">
                      {gc.isActive ? "Available to play" : "Currently unavailable"}
                    </CardDescription>
                  </div>
                  <Badge variant={gc.isActive ? "default" : "secondary"}>
                    {gc.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>Players</span>
                    </div>
                    <span className="font-medium">
                      {gc.minPlayers} - {gc.maxPlayers}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="h-4 w-4" />
                      <span>Entry Fee</span>
                    </div>
                    <span className="font-medium text-green-600">
                      {gc.serviceCharge}%
                    </span>
                  </div>
                </div>
              </CardContent>

              <div className="bg-muted/50 px-6 py-4 flex justify-center">

                <Button
                  asChild
                  size="lg"
                  disabled={!gc.isActive}
                  className="flex items-center gap-2 w-full"
                >
                  <Link href={`/games/${gc.gameType.toLowerCase()}`}>
                    <PlayCircle className="h-5 w-5" />
                    {gc.isActive ? "Play Now" : "Unavailable"}
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}

export default Games
