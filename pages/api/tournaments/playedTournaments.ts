import type { NextApiRequest, NextApiResponse } from 'next';
import type { tournament as TournamentT } from '@prisma/client';

import { prisma } from 'services/db';
import { PLAYED_TOURNAMENT_PAGE_SIZE } from 'constants/values';

// this api used only for /pages/tournaments/index to include linked data to the tournament
// and make paginated queries

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TournamentT[]>
) => {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string, 10);
    const paginationParams = page
      ? {
          skip: (page - 1) * PLAYED_TOURNAMENT_PAGE_SIZE,
          take: PLAYED_TOURNAMENT_PAGE_SIZE,
        }
      : undefined;

    const playedTournaments = await prisma.tournament.findMany({
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
      orderBy: {
        id: 'desc',
      },
      ...paginationParams,
    });

    res.json(playedTournaments);
  }
};
