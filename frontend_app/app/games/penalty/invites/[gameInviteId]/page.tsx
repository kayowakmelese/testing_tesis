import DebugJson from '@/components/custom/DebugJson';
import ErrorDisplay from '@/components/custom/ErrorDisplay';
import { getGameInviteDetail } from '@/server_actions/game-invite.actions';
import React from 'react';
import GameInviteRoomClient from './_components/GameInviteRoomClient';

type Props = {
  params: Promise<{
    gameInviteId: string;
  }>;
};

const Page = async (props: Props) => {
  const params = await props.params;
  const { gameInviteId } = params;
  const data = await getGameInviteDetail(gameInviteId);

  if (!data.success) {
    return <ErrorDisplay message={data.error} />;
  }

  return (
    <main className="container py-8">
      {/* Optional: keep debug during dev */}
      {/* <DebugJson data={data.data} /> */}

      <GameInviteRoomClient
        gameInvite={data.data}
      />
    </main>
  );
};

export default Page;