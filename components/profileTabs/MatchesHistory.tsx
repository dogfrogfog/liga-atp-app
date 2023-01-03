import type {
  match as MatchT,
  tournament as TournamentT,
  player as PlayerT,
} from '@prisma/client';
import { format } from 'date-fns';

import { getOpponents } from 'utils/getOpponents';
import MatchListElement from 'components/MatchListElement';

type MatchWithTournament = MatchT & {
  tournament: TournamentT;
  player_match_player1_idToplayer: PlayerT;
  player_match_player2_idToplayer: PlayerT;
  player_match_player3_idToplayer: PlayerT;
  player_match_player4_idToplayer: PlayerT;
};

const MatchesHistoryTab = ({
  playerId,
  playedMatches,
}: {
  playerId: number;
  playedMatches: MatchWithTournament[];
}) => {
  return (
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
          score={match?.score || ''}
          opponent={getOpponents(playerId, match)}
          win={String(playerId) === match.winner_id}
        />
      ))}
    </>
  );
};

export default MatchesHistoryTab;
