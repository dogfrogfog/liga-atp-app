import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from 'services/db';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const id = parseInt(req.query.id as string, 10);

    const [player, digests] = await prisma.$transaction([
      prisma.player.findUnique({
        where: {
          id,
        },
      }),
      prisma.digest.findMany({
        where: {
          mentioned_players_ids: {
            has: id,
          },
        },
      }),
    ]);

    res.json({ player, digests });
  }
};
