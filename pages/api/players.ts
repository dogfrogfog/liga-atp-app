import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<PlayerT[] | PlayerT | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const players = await prisma.player.findMany();

    res.json(players);
  }
};
