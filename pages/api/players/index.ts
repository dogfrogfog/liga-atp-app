import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';

const PAGE_SIZE = 100;

export default async (
  req: NextApiRequest,
  res: NextApiResponse<PlayerT[] | PlayerT | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    // not used
    const page = parseInt(req.query.page as string, 10);
    const paginationParams = page
      ? {
          skip: page > 1 ? page * PAGE_SIZE : 0,
          take: PAGE_SIZE,
        }
      : undefined;

    const players = await prisma.player.findMany({
      orderBy: {
        id: 'desc',
      },
      ...paginationParams,
    });

    res.json(players);
  }

  if (req.method === 'POST') {
    const createdPlayer = await prisma.player.create({
      data: req.body.data,
    });

    res.json(createdPlayer);
  }

  if (req.method === 'DELETE') {
    const deletedPlayer = await prisma.player.delete({
      where: {
        id: parseInt(req.body, 10),
      },
    });

    res.json(deletedPlayer);
  }

  if (req.method === 'PUT') {
    const updatedPlayer = await prisma.player.update({
      where: {
        id: req.body.data.id,
      },
      data: req.body.data,
    });

    res.json(updatedPlayer);
  }
};
