import type {
  tournament as TournamentT,
  match as MatchT,
  player as PlayerT,
} from '@prisma/client';

type MatchWithTournamentType = MatchT & {
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
  const isDoubles = match.tournament.is_doubles;
  const isFirstPlayer = playerId === p1.id;

  // we have cases where 'is_doubles' is null but it's still a double tournament (has player3 and player4)
  const hasBothTherdAndFourthPlayers = p4 && p4;

  if (isDoubles || hasBothTherdAndFourthPlayers) {
    if (isFirstPlayer) {
      // @ts-ignore
      return `${p2 ? `${p2.first_name[0]}. ${p2.last_name}` : 'tbd'} / ${
        // @ts-ignore
        p4 ? `${p4.first_name[0]}. ${p4.last_name}` : 'tbd'
        }`;
    } else {
      // @ts-ignore
      return `${p1 ? `${p1.first_name[0]}. ${p1.last_name}` : 'tbd'} / ${
        // @ts-ignore
        p1 ? `${p3.first_name[0]}. ${p3.last_name}` : 'tbd'
        }`;
    }
  } else {
    if (isFirstPlayer) {
      // @ts-ignore
      return p2 ? `${(p2?.first_name)[0]}. ${p2.last_name}` : 'tbd';
    } else {
      // @ts-ignore
      return p1 ? `${p1.first_name[0]}. ${p1.last_name}` : 'tbd';
    }
  }
};
