import type {
  tournament as TournamentT,
  match as MatchT,
  player as PlayerT,
} from '@prisma/client';
import type { ReactNode } from 'react';
import Link from 'next/link';

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
    ) ||
    match.tournament.is_doubles ||
    // we have cases where 'is_doubles' is null but it's still a double tournament (has player3 and player4)
    p3 ||
    p4;

  // to get opponent name in singles match
  if (!isDoubles) {
    let opponentName: string | ReactNode = 'unknown';

    if (playerId === p1?.id) {
      if (p2) {
        opponentName = (
          <Link href={`/players/${p2.id}`}>{`${(p2.first_name as string)[0]}. ${
            p2.last_name
          }`}</Link>
        );
      }
    }

    if (playerId === p2?.id) {
      if (p1) {
        opponentName = (
          <Link href={`/players/${p1.id}`}>{`${(p1.first_name as string)[0]}. ${
            p1.last_name
          }`}</Link>
        );
      }
    }

    return opponentName;
  } else {
    let opponentOneName: string | ReactNode = 'unknown';
    let opponentTwoName: string | ReactNode = 'unknown';

    // OLD FORMAT
    // team 1 = [p1, p2]
    // team 2 = [p3, p4]
    // NEW FORMAT
    // team 1 = [p1, p3]
    // team 2 = [p2, p4]
    // only new tournaments have status field
    const isOldFormat = !match.tournament.status;
    if (isOldFormat) {
      if (playerId === p1.id || playerId === p2.id) {
        if (p3) {
          opponentOneName = (
            <Link href={`/players/${p3.id}`}>{`${
              (p3.first_name as string)[0]
            }. ${p3.last_name}`}</Link>
          );
        }
        if (p4) {
          opponentTwoName = (
            <Link href={`/players/${p4.id}`}>{`${
              (p4.first_name as string)[0]
            }. ${p4.last_name}`}</Link>
          );
        }
      }

      if (playerId === p3?.id || playerId === p4?.id) {
        if (p1) {
          opponentOneName = (
            <Link href={`/players/${p1.id}`}>{`${
              (p1.first_name as string)[0]
            }. ${p1.last_name}`}</Link>
          );
        }
        if (p2) {
          opponentTwoName = (
            <Link href={`/players/${p2.id}`}>{`${
              (p2.first_name as string)[0]
            }. ${p2.last_name}`}</Link>
          );
        }
      }
    } else {
      if (playerId === p1.id || playerId === p3.id) {
        if (p2) {
          opponentOneName = (
            <Link href={`/players/${p2.id}`}>{`${
              (p2.first_name as string)[0]
            }. ${p2.last_name}`}</Link>
          );
        }
        if (p4) {
          opponentTwoName = (
            <Link href={`/players/${p4.id}`}>{`${
              (p4.first_name as string)[0]
            }. ${p4.last_name}`}</Link>
          );
        }
      }

      if (playerId === p2.id || playerId === p4.id) {
        if (p1) {
          opponentOneName = (
            <Link href={`/players/${p1.id}`}>{`${
              (p1.first_name as string)[0]
            }. ${p1.last_name}`}</Link>
          );
        }
        if (p3) {
          opponentTwoName = (
            <Link href={`/players/${p3.id}`}>{`${
              (p3.first_name as string)[0]
            }. ${p3.last_name}`}</Link>
          );
        }
      }
    }

    return (
      <>
        {opponentOneName} / {opponentTwoName}
      </>
    );
  }
};
