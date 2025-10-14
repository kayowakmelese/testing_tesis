import ErrorDisplay from '@/components/custom/ErrorDisplay';
import { getGameRoom } from '@/server_actions/game-room.actions';
import React from 'react';
import GameRenderer from '../../_components/GameRenderer';

type Props = {
  params: Promise<{ gameId: string }>;
};

const GameSpace = async (props: Props) => {
  const params = await props.params;
  const gameId = params.gameId;

  const game = await getGameRoom(gameId);

  if (!game.success) {
    return <ErrorDisplay message={game.error} />;
  }

  // Pass game.data to renderer
  return (
    <main>
      {/* Optional: keep debug during dev */}
      {/* <DebugJson data={game.data} /> */}
      <GameRenderer game={game.data} />
    </main>
  );
};

export default GameSpace;