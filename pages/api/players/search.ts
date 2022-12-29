import type { NextApiRequest, NextApiResponse } from 'next';
import { player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (req: NextApiRequest, res: NextApiResponse<PlayerT[]>) => {
  if (req.method === 'GET') {
    const searchPlayers = await prisma.player.findMany({
      where: {
        // TODO:
        // add search by last_name as well
        // filters should also be reflected here
        first_name: {
          // remove case sensitivity
          contains: req.query.name as string,
        },
      },
    });

    res.json(searchPlayers);
  }
};
