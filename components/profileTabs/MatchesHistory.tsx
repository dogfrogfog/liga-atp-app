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
  console.log('id', playedMatches.filter(el => el.id === null));
  console.log('playedMatchesFiler2', playedMatches.filter(el => el.player_match_player2_idToplayer === undefined));
  
  return (
    <>
      {playedMatches.map((match, index) => (
        <MatchListElement playerId={playerId} match={match} key={index} />
      ))}
    </>
  );
}

export default MatchesHistoryTab;
