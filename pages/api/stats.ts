import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'services/db';

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

    const p = await prisma.player.findUnique({
      where: {
        id: parseInt(playerId as string, 10),
      },
      include: {
        match_match_player1_idToplayer: true,
        match_match_player2_idToplayer: true,
        match_match_player3_idToplayer: true,
        match_match_player4_idToplayer: true,
      },
    });

    // const tournaments = await prisma.tournament.findMany();

    const matchesPlayed = [
      // @ts-ignore
      ...p?.match_match_player1_idToplayer,
      // @ts-ignore
      ...p?.match_match_player2_idToplayer,
      // @ts-ignore
      ...p?.match_match_player3_idToplayer,
      // @ts-ignore
      ...p?.match_match_player1_idToplayer,
    ];

    const { tournamentsNumber } = matchesPlayed.reduce(
      (acc, t) => {
        if (acc.tournamentIds.indexOf(t.id) === -1) {
          acc.tournamentsNumber += 1;
          acc.tournamentIds.push(t.id);
        }

        return acc;
      },
      { tournamentsNumber: 0, tournamentIds: [] as number[] }
    );

    // if (level) {

    // }

    const statsData = {
      tournaments_played: tournamentsNumber,
      tournaments_wins: 2,
      matches_played_in_level: 31,
      finals_number: 5,
      win_lose_in_level_proportion: '33%',
      win_lose_with_first_set_lose_proportion: '67%',
      two_three_sets_matches_proportion: '99%',
      lose_matches_with_zero_points: '2%',
      win_matches_with_zero_opponent_points: '100%',
    };

    res.json(statsData);
  }
};
