import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<PlayerT[] | PlayerT | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const isPaginated = !!(req.query.take && req.query.skip);

    const playersList = await prisma.player.findMany(
      isPaginated
        ? {
            take: parseInt(req.query.take as string),
            skip: parseInt(req.query.skip as string),
            orderBy: {
              id: 'desc',
            },
          }
        : undefined
    );

    res.json(playersList);
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
