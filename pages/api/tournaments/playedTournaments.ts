import type { NextApiRequest, NextApiResponse } from 'next';
import type { tournament as TournamentT } from '@prisma/client';

import { prisma } from 'services/db';

// this api used only for /pages/tournaments/index to include linked data to the tournament
// and make paginated queries

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TournamentT[]>
) => {
  if (req.method === 'GET') {
    // add pagination
    const playedTournaments = await prisma.tournament.findMany({
      orderBy: {
        id: 'desc',
      },
      where: {
        OR: [
          {
            status: {
              // status "3" is finished tournament
              in: 3,
            },
          },
          {
            // field exists in old data format
            is_finished: true,
          },
        ],
      },
    });

    res.json(playedTournaments);
  }
};
