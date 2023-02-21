import type { NextApiRequest, NextApiResponse } from 'next';

import getPlayersChangedEloPoins from 'utils/elo/getPlayersChangedEloPoins';
import { prisma } from 'services/db';

const HALF_A_YEAR_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30 * 6;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const playersEloRankings = await prisma.player_elo_ranking.findMany({
      where: {
        expire_date: {
          gt: new Date(),
        },
      },
    });

    res.json(playersEloRankings);
  }

  if (req.method === 'POST') {
    const now = new Date();
    const { id: matchId, ...matchData } = req.body.data;
    const commonData = {
      change_date: now,
      match_id: matchId,
    };

    const [matches, p1Elo, p2Elo, p1EloRecords, p2EloRecords] =
      await prisma.$transaction([
        prisma.match.findMany({
          where: {
            OR: [
              { player1_id: matchData.player1_id },
              { player1_id: matchData.player2_id },
              { player2_id: matchData.player1_id },
              { player2_id: matchData.player2_id },
            ],
          },
          include: {
            player_match_player1_idToplayer: true,
            player_match_player2_idToplayer: true,
          },
        }),
        prisma.player_elo_ranking.findUnique({
          where: {
            player_id: matchData.player1_id,
          },
        }),
        prisma.player_elo_ranking.findUnique({
          where: {
            player_id: matchData.player2_id,
          },
        }),
        prisma.elo_ranking_change.findMany({
          where: {
            player_id: matchData.player1_id,
          },
          orderBy: {
            id: 'desc',
          },
          take: 5,
        }),
        prisma.elo_ranking_change.findMany({
          where: {
            player_id: matchData.player2_id,
          },
          orderBy: {
            id: 'desc',
          },
          take: 5,
        }),
      ]);

    let matchesPlayedP1 = 0;
    let matchesPlayedP2 = 0;
    for (const m of matches) {
      if (m.player1_id === matchData.player1_id) {
        matchesPlayedP1 += 1;
      }
      if (m.player2_id === matchData.player2_id) {
        matchesPlayedP2 += 1;
      }
    }

    const { changedEloPointsP1, changedEloPointsP2 } =
      getPlayersChangedEloPoins(
        matchData,
        { id: matchData.player1_id, elo_points: p1Elo?.elo_points as number },
        { id: matchData.player2_id, elo_points: p2Elo?.elo_points as number },
        matchesPlayedP1,
        matchesPlayedP2
      );

    // update expire_date to only if there is more then 5 matches for the last 6 months
    const sixMonthAfterNow = new Date().getTime() + HALF_A_YEAR_IN_MILLISECONDS;
    const expire_date1 =
      p1EloRecords.length === 5 &&
      (p1EloRecords[4].change_date as Date).getTime() +
        HALF_A_YEAR_IN_MILLISECONDS >=
        now.getTime()
        ? new Date(sixMonthAfterNow)
        : now;
    const expire_date2 =
      p2EloRecords.length === 5 &&
      (p2EloRecords[4].change_date as Date).getTime() +
        HALF_A_YEAR_IN_MILLISECONDS >=
        now.getTime()
        ? new Date(sixMonthAfterNow)
        : now;

    await prisma.player_elo_ranking.update({
      where: {
        player_id: matchData.player1_id,
      },
      data: {
        elo_points: changedEloPointsP1,
        expire_date: expire_date1,
      },
    });

    await prisma.player_elo_ranking.update({
      where: {
        player_id: matchData.player2_id,
      },
      data: {
        elo_points: changedEloPointsP2,
        expire_date: expire_date2,
      },
    });

    await prisma.elo_ranking_change.createMany({
      data: [
        {
          player_id: matchData.player1_id,
          current_elo_points: p1Elo?.elo_points,
          new_elo_points: changedEloPointsP1,
          ...commonData,
        },
        {
          player_id: matchData.player2_id,
          current_elo_points: p2Elo?.elo_points,
          new_elo_points: changedEloPointsP2,
          ...commonData,
        },
      ],
    });

    res.status(200).json({});
  }
};
