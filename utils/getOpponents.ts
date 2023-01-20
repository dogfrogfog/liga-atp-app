import type {
  tournament as TournamentT,
  match as MatchT,
  player as PlayerT,
} from '@prisma/client';

import { DOUBLES_TOURNAMENT_TYPES_NUMBER } from 'constants/values';

export type MatchWithTournamentType = MatchT & {
  tournament: TournamentT;
  player_match_player1_idToplayer: PlayerT;
  player_match_player2_idToplayer: PlayerT;
  player_match_player3_idToplayer: PlayerT;
  player_match_player4_idToplayer: PlayerT;
};

export const getOpponents = (
  playerId: number,
  match: MatchWithTournamentType
) => {
  const {
    player_match_player1_idToplayer: p1,
    player_match_player2_idToplayer: p2,
    player_match_player3_idToplayer: p3,
    player_match_player4_idToplayer: p4,
  } = match;
  const isDoubles =
    DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
      match.tournament.tournament_type as number
    ) || match.tournament.is_doubles;

  // get opponent id in singles match
  if (!isDoubles) {
    if (playerId === p1.id) {
      return p2 ? `${(p2.first_name as string)[0]}. ${p2.last_name}` : 'tbd';
    }

    if (playerId === p2.id) {
      return p1 ? `${(p1.first_name as string)[0]}. ${p1.last_name}` : 'tbd';
    }
  }

  // we have cases where 'is_doubles' is null but it's still a double tournament (has player3 and player4)
  const hasMoreThenTwoPlayers = p3 || p4;
  if (isDoubles || hasMoreThenTwoPlayers) {
    if (playerId === p1.id || playerId === p3.id) {
      // @ts-ignore
      return `${p2 ? `${p2.first_name[0]}. ${p2.last_name}` : 'tbd'} / ${
        // @ts-ignore
        p4 ? `${p4.first_name[0]}. ${p4.last_name}` : 'tbd'
      }`;
    }

    if (playerId === p2.id || playerId === p4.id) {
      // @ts-ignore
      return `${p1 ? `${p2.first_name[0]}. ${p1.last_name}` : 'tbd'} / ${
        // @ts-ignore
        p4 ? `${p3.first_name[0]}. ${p3.last_name}` : 'tbd'
      }`;
    }
  }

  return '';
};
