import type { NextApiRequest, NextApiResponse } from 'next';
import type {
  tournament as TournamentT,
  match as MatchT,
} from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<(TournamentT & { match: MatchT[] }) | string>
) => {
  if (req.method === 'GET') {
    if (!req.query.id) {
      res.status(404).send('should include query.id');
    } else {
      const tournamentWithMatches = await prisma.tournament.findUnique({
        where: {
          id: parseInt(req.query.id as string, 10),
        },
        include: {
          match: true,
        },
      });

      res.json(tournamentWithMatches as any);
    }
  }
};
