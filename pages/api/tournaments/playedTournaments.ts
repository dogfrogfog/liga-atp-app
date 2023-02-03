import type { NextApiRequest, NextApiResponse } from 'next';
import type { tournament as TournamentT } from '@prisma/client';

import { prisma } from 'services/db';

// this api used only for /pages/tournaments/index to include linked data to the tournament
// and make paginated queries

const PAGE_SIZE = 30;
export default async (
  req: NextApiRequest,
  res: NextApiResponse<TournamentT[]>
) => {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string, 10);

    const playedTournaments = await prisma.tournament.findMany({
      orderBy: {
        id: 'desc',
      },
      skip: page > 1 ? page * PAGE_SIZE : 0,
      take: PAGE_SIZE,
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
      include: {
        match: true,
      },
    });

    res.json(playedTournaments);
  }
};
