import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  tournament as TournamentT,
  match as MatchT,
} from '@prisma/client';

import { prisma } from 'services/db';
import { isMatchPlayed } from 'utils/isMatchPlayed';
import { isPlayerWon } from 'utils/isPlayerWon';

export type StatsDataType = {
  tournaments_played: number;
  tournaments_wins: number;
  matches_played: number;
  tournaments_finals: number;
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
    const { id, tournament_type } = req.query;
    const playerIdInt = parseInt(id as string, 10);

    const p = await prisma.player.findUnique({
      where: {
        id: playerIdInt,
      },
    });

    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player1_id: playerIdInt },
          { player2_id: playerIdInt },
          { player3_id: playerIdInt },
          { player4_id: playerIdInt },
        ],
      },
      include: {
        tournament: true,
      },
    });

    const playedMatches = matches.filter((m) =>
      isMatchPlayed(m as any)
    ) as (MatchT & { tournament: TournamentT })[];

    const matchesMap = playedMatches.reduce(
      (acc, m) => acc.set(m.id, m),
      new Map<number, MatchT>()
    );
    const filteredPlayedMatches = tournament_type
      ? playedMatches.filter(
          (m) =>
            m.tournament.tournament_type ===
            parseInt(tournament_type as string, 10)
        )
      : playedMatches;

    // just to remove same tournaments
    const uniqueTournamentsIds = [] as number[];
    const {
      tournamentsPlayed,
      twoSetsMatchesNumber,
      threeSetsMatchesNumber,
      wins,
      losses,
    } = filteredPlayedMatches.reduce(
      (acc, m) => {
        if (!uniqueTournamentsIds.includes(m.tournament_id as number)) {
          uniqueTournamentsIds.push(m.tournament_id as number);
          acc.tournamentsPlayed.push(m.tournament as TournamentT);

          // todo: count wins
          // todo: count finals
        }

        const numberOfSets = (m.score?.match(/-/g) || []).length;
        if (numberOfSets === 2) {
          acc.twoSetsMatchesNumber += 1;
        }

        if (numberOfSets === 3) {
          acc.threeSetsMatchesNumber += 1;
        }

        if (isPlayerWon(playerIdInt, m)) {
          acc.wins += 1;
        } else {
          acc.losses += 1;
        }

        // todo
        // if(m.winner_id !== '' || m.winner_id !== playerId) {

        // }

        return acc;
      },
      {
        tournamentsPlayed: [] as TournamentT[],
        twoSetsMatchesNumber: 0,
        threeSetsMatchesNumber: 0,
        wins: 0,
        losses: 0,
      }
    );

 

    // const { finals, tournamentWins } = Array(tournamentsMap.keys()).reduce(
    //   (acc, tId) => {
    //     const tournament = tournamentsMap.get(tId);

    //     const brackets = tournament?.draw
    //       ? JSON.parse(tournament.draw).brackets
    //       : null;

    //     // old brackets format
    //     // to support legacy data in db
    //     // we get matchId from brackets if exists
    //     // and increase counter if player was in finals/won the tournament
    //     // if no data in brackets field then we should skip tournament and not count
    //     if (brackets && brackets[0].id) {
    //       const lastMatchId = brackets[brackets.length - 1]?.matchId;
    //       lastMatch = lastMatchId ? matchesMap.get(lastMatchId) : undefined;
    //     }

    //     // not count doubles
    //     if (lastMatch) {
    //       const isInFinals = [
    //         lastMatch?.player1_id,
    //         lastMatch?.player2_id,
    //       ].includes(playerIdInt)
    //         ? 1
    //         : 0;
    //       const isWinner = id === lastMatch?.winner_id ? 1 : 0;

    //       acc.finals += isInFinals;
    //       acc.tournamentWins += isWinner;
    //     }

    //     return acc;
    //   },
    //   {
    //     finals: 0,
    //     tournamentWins: 0,
    //   }
    // );
    // @ts-ignore filteredPlayedMatches doesn't need to include players data here
    const statsData = {
      tournaments_played: tournamentsPlayed.length,
      matches_played: filteredPlayedMatches.length,
      tournaments_wins: 'tournamentWins',
      tournaments_finals: 'finals',
      win_lose_in_level_proportion: `${wins}/${losses}`,
      win_lose_with_first_set_lose_proportion: 'tbd',
      two_three_sets_matches_proportion: `${twoSetsMatchesNumber}/${threeSetsMatchesNumber}`,
      lose_matches_with_zero_points: 'tbd',
      win_matches_with_zero_opponent_points: 'tbd',
    };

    res.json(statsData);
  }
};
