import type {
  match as MatchT,
  tournament as TournamentT,
} from '@prisma/client';

import { DOUBLES_TOURNAMENT_TYPES_NUMBER } from 'constants/values';

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

  // handle new doubles format
  if (isDoubles) {
    const team1 = [m.player1_id, m.player3_id];
    const team2 = [m.player2_id, m.player4_id];

    const targetPlayerInFirstTeam = team1.includes(playerId);

    if (
      targetPlayerInFirstTeam &&
      team1.includes(parseInt(m.winner_id as string, 10))
    ) {
      return true; // player in first team, that won the match
    } else if (
      !targetPlayerInFirstTeam &&
      team2.includes(parseInt(m.winner_id as string, 10))
    ) {
      return true; // player in second team, that won the match
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
