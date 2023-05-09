import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<PlayerT[] | PlayerT | Prisma.BatchPayload>
) => {
  if (req.method === 'POST') {
    if (!req.body.data) {
      res.status(404);
    }

    const { elo_points, ...playerData } = req.body.data;
    const createdPlayer = await prisma.player.create({
      data: playerData,
    });

    await prisma.player_elo_ranking.create({
      data: {
        player_id: createdPlayer.id,
        elo_points,
      },
    });

    res.json(createdPlayer);
  }

  if (req.method === 'PUT') {
    if (!req.body.data.id) {
      res.status(404);
    }

    const updatedPlayer = await prisma.player.update({
      where: {
        id: req.body.data.id,
      },
      data: req.body.data,
    });

    res.json(updatedPlayer);
  }

  if (req.method === 'DELETE') {
    if (!req.body) {
      res.status(404);
    }

    const id = parseInt(req.body, 10);

    const deletedPlayer = await prisma.player.delete({
      where: {
        id,
      },
    });

    await prisma.player_elo_ranking.delete({
      where: {
        player_id: id,
      },
    });

    res.json(deletedPlayer);
  }
};
