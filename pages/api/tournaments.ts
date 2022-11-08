import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient, tournament } from '@prisma/client'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<tournament | tournament[] | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const paginatedTournaments = await prisma.tournament.findMany({
      take: parseInt(req.query.take as string),
      skip: parseInt(req.query.skip as string),
    })

    res.json(paginatedTournaments)
  }

  // if (req.method === 'POST') {
  //   const createdPlayer = await prisma.tournament.create({
  //     data: req.body.data,
  //   })

  //   console.log(createdPlayer)

  //   res.json(createdPlayer)
  // }
}
