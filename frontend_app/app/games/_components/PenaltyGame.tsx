import { PenaltyGameProvider } from '../_contexts/PenaltyGameContext';
import PenaltyGameUI from './PenaltyGameUI';
import { Game, GameConfig } from '@/types';


const PenaltyGame = ({ game }: { game: Game & {config:GameConfig} }) => {

  return (
    <PenaltyGameProvider game={game}>
      <PenaltyGameUI />
    </PenaltyGameProvider>
  );
};

export default PenaltyGame;