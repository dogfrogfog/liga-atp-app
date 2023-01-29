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
}) => (
  <>
    {playedMatches.map((match, index) => (
      <MatchListElement
        withCompareLink
        key={index}
        tournamentName={match.tournament.name || ''}
        startDate={
          match?.start_date
            ? format(new Date(match.start_date), 'yyyy-MM-dd')
            : ''
        }
        // leave score empty to display w/o
        score={match?.score || 'w/o'}
        p2Name={getOpponents(playerId, match)}
        isMainPlayerWin={isPlayerWon(playerId, match)}
        youtubeLink={match?.youtube_link || ''}
      />
    ))}
  </>
);

export default MatchesHistoryTab;
