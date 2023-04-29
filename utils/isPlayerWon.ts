import type {
  match as MatchT,
  tournament as TournamentT,
} from '@prisma/client';

import { DOUBLES_TOURNAMENT_TYPES_NUMBER } from 'constants/values';
// import type { MatchWithTournamentType } from 'utils/getOpponents';

export const isPlayerWon = (
  playerId: number,
  m: MatchT & { tournament: TournamentT }
) => {
  const isDoubles = !!(
    (m.player3_id && m.player4_id) ||
    DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
      m.tournament.tournament_type as number
    )
  );
  const isOldDoublesFormat =
    isDoubles &&
    m.tournament.status === null &&
    (m.winner_id as string)?.length > 4;

  // handle old doubles format
  if (isOldDoublesFormat) {
    const winnerIds = (m.winner_id as string).split('012340');

    if (winnerIds.includes(playerId + '')) {
      return true;
    } else {
      return false;
    }
  }

  console.log('isDoubles',isDoubles);
  console.log('isOldDoublesFormat', isOldDoublesFormat);
  
  // handle new doubles format
  if (isDoubles) {
    const team1 = [m.player1_id, m.player3_id];

    const targetPlayerInFirstTeam = team1.includes(playerId);

    // player in first team, that won the match
    if (
      targetPlayerInFirstTeam &&
      team1.includes(parseInt(m.winner_id as string, 10))
    ) {
      console.log();
      
      return true;
    } else {
      return false;
    }
  }

  // handle singles format
  if (!isDoubles) {
    if (m.winner_id === playerId + '') {
      return true;
    } else {
      return false;
    }
  }

  return false;
};
