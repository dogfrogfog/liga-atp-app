import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, core_player } from '@prisma/client'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<core_player[]>
) => {
  if (req.method === 'GET') {
    const paginatedPlayers = await prisma.core_player.findMany({
      take: parseInt(req.query.take as string),
      skip: parseInt(req.query.skip as string),
    })

    res.json(paginatedPlayers)
  }
}
