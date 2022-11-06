import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient, core_player } from '@prisma/client'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<core_player | core_player[] | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const paginatedPlayers = await prisma.core_player.findMany({
      take: parseInt(req.query.take as string),
      skip: parseInt(req.query.skip as string),
    })

    res.json(paginatedPlayers)
  }

  if (req.method === 'POST') {
    const createdPlayer = await prisma.core_player.create({
      data: req.body.data,
    })

    console.log(createdPlayer)

    res.json(createdPlayer)
  }

  if (req.method === 'DELETE') {
    const deletedPlayers = await prisma.core_player.deleteMany({
      where: {
        id: {
          // todo: add multiple delete operation
          equals: req.body[0],
        },
      },
    })

    res.json(deletedPlayers)
  }

  if (req.method === 'PUT') {
    const updatedPlayer = await prisma.core_player.update({
      where: {
        id: req.body.data.id
      },
      data: req.body.data,
    })

    res.json(updatedPlayer)
  }
}
