import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient, player as PlayerT } from '@prisma/client'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<PlayerT[] | PlayerT | Prisma.BatchPayload>,
) => {
  if (req.method === 'GET') {
    const paginatedPlayers = await prisma.player.findMany({
      take: parseInt(req.query.take as string),
      skip: parseInt(req.query.skip as string),
    });

    res.json(paginatedPlayers);
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
        id: req.body.data,
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
}
