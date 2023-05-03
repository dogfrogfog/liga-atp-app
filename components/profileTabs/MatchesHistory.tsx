import { format } from 'date-fns';

import { getOpponents, MatchWithTournamentType } from 'utils/getOpponents';
import MatchListElement from 'components/MatchListElement';
import { isPlayerWon } from 'utils/isPlayerWon';

const MatchesHistoryTab = ({
  playerId,
  playedMatches,
}: {
  playerId: number;
  playedMatches: MatchWithTournamentType[];
}) => {
  console.log('playedMatches', playedMatches);
  
  return (
    <>
      {playedMatches.map((match, index) => (
        <MatchListElement playerId={playerId} match={match} key={index} />
      ))}
    </>
  );
}

export default MatchesHistoryTab;
