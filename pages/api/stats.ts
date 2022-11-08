import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, player } from '@prisma/client'
import { AiOutlineConsoleSql } from 'react-icons/ai'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<player[] | player>
) => {
  // if (req.method === 'GET') {
  //   const paginatedPlayers = await prisma.player.findMany({
  //     take: parseInt(req.query.take as string),
  //     skip: parseInt(req.query.skip as string),
  //   })

  //   res.json(paginatedPlayers)
  // }

  // if (req.method === 'POST') {
  //   const createdPlayer = await prisma.player.create({
  //     data: req.body.data,
  //   })

  //   res.json(createdPlayer)
  // }
}
