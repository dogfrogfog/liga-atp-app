import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'services/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const playersEloRankings = await prisma.player_elo_ranking.findMany({
      select: {
        player_id: true,
        elo_points: true,
      },
    });

    res.json(playersEloRankings);
  }
};
