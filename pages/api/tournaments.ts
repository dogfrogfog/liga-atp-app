import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient, core_tournament } from '@prisma/client'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<core_tournament | core_tournament[] | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const paginatedTournaments = await prisma.core_tournament.findMany({
      take: parseInt(req.query.take as string),
      skip: parseInt(req.query.skip as string),
    })

    res.json(paginatedTournaments)
  }

  // if (req.method === 'POST') {
  //   const createdPlayer = await prisma.core_tournament.create({
  //     data: req.body.data,
  //   })

  //   console.log(createdPlayer)

  //   res.json(createdPlayer)
  // }
}
