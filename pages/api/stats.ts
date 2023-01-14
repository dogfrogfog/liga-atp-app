import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  tournament as TournamentT,
  match as MatchT,
} from '@prisma/client';

import { prisma } from 'services/db';
import { GiConsoleController } from 'react-icons/gi';

// will count only in singles, because winner id can be either p1 or p2 id
const getWinLoseProportion = (playerId: number, matches: MatchT[]): string => {
  const { wins, losses } = matches.reduce(
    (acc, m) => {
      if (parseInt(m.winner_id as string, 10) === playerId) {
        acc.wins += 1;
      } else {
        acc.losses += 1;
      }

      return acc;
    },
    { wins: 0, losses: 0 }
  );

  // console.log(matches.length, 'wins: ' + wins + ' ///// losses: ' + losses);

  return `${wins}/${losses}`;
};

export type StatsDataType = {
  tournaments_played: number;
  tournaments_wins: number;
  matches_played_in_level: number;
  finals_number: number;
  win_lose_in_level_proportion: string;
  // Процент побед/поражений побед после поражения в первом сете
  win_lose_with_first_set_lose_proportion: string;
  // Процент двухсетовики/трехсетовиков
  two_three_sets_matches_proportion: string;
  // проигрыш в ноль
  lose_matches_with_zero_points: string;
  // выигрыш в ноль
  win_matches_with_zero_opponent_points: string;
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<StatsDataType>
) => {
  if (req.method === 'GET') {
    const { playerId, level } = req.query;
    const playerIdInt = parseInt(playerId as string, 10);

    const p = await prisma.player.findUnique({
      where: {
        id: playerIdInt,
      },
      include: {
        match_match_player1_idToplayer: true,
        match_match_player2_idToplayer: true,
        match_match_player3_idToplayer: true,
        match_match_player4_idToplayer: true,
      },
    });

    const tournaments = await prisma.tournament.findMany();
    const tournamentsMap = tournaments.reduce((map, t) => {
      map.set(t.id, t);
      return map;
    }, new Map<number, TournamentT>());

    const { uniqueSinglesMatches } = (
      [
        // @ts-ignore
        ...p?.match_match_player1_idToplayer,
        // @ts-ignore
        ...p?.match_match_player2_idToplayer,
        // @ts-ignore
        ...p?.match_match_player3_idToplayer,
        // @ts-ignore
        ...p?.match_match_player1_idToplayer,
      ] as MatchT[]
    ).reduce(
      (acc, m) => {
        if (!(m.is_completed === true || (m.winner_id && m.score))) {
          return acc;
        }

        // to filter doubles matches
        if (!acc.ids.includes(m.id)) {
          // console.log(tournamentsMap.get(m.tournament_id as number));
          // && !tournamentsMap.get(m.tournament_id as number)?.is_doubl÷÷es
          acc.ids.push(m.id);
          acc.uniqueSinglesMatches.push(m as MatchT);
        }

        return acc;
      },
      { uniqueSinglesMatches: [] as MatchT[], ids: [] as number[] }
    );
    const matchesMap = uniqueSinglesMatches.reduce((map, m) => {
      map.set(m.id, m);
      return map;
    }, new Map<number, MatchT>());

    const { tournamentsNumber, tournamentIds } = uniqueSinglesMatches.reduce(
      (acc, m) => {
        // to count only unique ids
        // only singles
        if (!acc.tournamentIds.includes(m.tournament_id as number)) {
          acc.tournamentsNumber += 1;
          acc.tournamentIds.push(m.tournament_id as number);
          // console.log(t);
        }

        return acc;
      },
      { tournamentsNumber: 0, tournamentIds: [] as number[] }
    );

    const { finals, tournamentWins } = tournamentIds.reduce(
      (acc, tId) => {
        const tournament = tournamentsMap.get(tId);

        const brackets = tournament?.draw
          ? JSON.parse(tournament.draw).brackets
          : null;

        let lastMatch: undefined | MatchT;

        // new brackets format
        if (brackets && Array.isArray(brackets[0])) {
          const lastMatchId = brackets[brackets.length - 1][0]?.matchId;
          lastMatch = lastMatchId ? matchesMap.get(lastMatchId) : undefined;
        }

        // old brackets format
        // to support legacy data in db
        // we get matchId from brackets if exists
        // and increase counter if player was in finals/won the tournament
        // if no data in brackets field then we should skip tournament and not count
        if (brackets && brackets[0].id) {
          const lastMatchId = brackets[brackets.length - 1]?.matchId;
          lastMatch = lastMatchId ? matchesMap.get(lastMatchId) : undefined;
        }

        // not count doubles
        if (lastMatch) {
          const isInFinals = [
            lastMatch?.player1_id,
            lastMatch?.player2_id,
          ].includes(playerIdInt)
            ? 1
            : 0;
          const isWinner = playerId === lastMatch?.winner_id ? 1 : 0;

          acc.finals += isInFinals;
          acc.tournamentWins += isWinner;
        }

        return acc;
      },
      {
        finals: 0,
        tournamentWins: 0,
      }
    );

    const winLoseProportion = getWinLoseProportion(
      playerIdInt,
      uniqueSinglesMatches
    );

    const statsData = {
      tournaments_played: tournamentsNumber,
      tournaments_wins: tournamentWins,
      matches_played_in_level: uniqueSinglesMatches.length,
      finals_number: finals,
      win_lose_in_level_proportion: winLoseProportion,
      win_lose_with_first_set_lose_proportion: 'tbd',
      two_three_sets_matches_proportion: 'tbd',
      lose_matches_with_zero_points: 'tbd',
      win_matches_with_zero_opponent_points: 'tbd',
    };

    res.json(statsData);
  }
};
