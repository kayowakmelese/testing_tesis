// src/components/games/GameRenderer.tsx
import { Game, GAME_TYPE, GameConfig } from '@/types'; // Adjust based on your actual type
import ErrorDisplay from '@/components/custom/ErrorDisplay';
import PenaltyGame from './PenaltyGame';

type GameRendererProps = {
  game: Game & {config:GameConfig}

};

const GameRenderer = ({ game }: GameRendererProps) => {
  const gameType = game.gameInvite.gameType;

  switch (gameType) {
    case GAME_TYPE.PENALTY:
      return <PenaltyGame game={game} />;
    // case 'CHESS': return <ChessGame game={game} />;
    // case 'PUZZLE': return <PuzzleGame game={game} />;
    default:
      return (
        <ErrorDisplay message={`Unsupported game type: ${gameType}`} />
      );
  }
};

export default GameRenderer;