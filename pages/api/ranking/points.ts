import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'services/db';

// const HALF_A_YEAR_IN_MILLISECONDS = 1000 * 60 * 60 * 24 * 30 * 6;

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
};
