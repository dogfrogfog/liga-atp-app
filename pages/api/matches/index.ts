import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, match } from '@prisma/client'


export default async (
  req: NextApiRequest,
  res: NextApiResponse<match[]>
) => {
  const prisma = new PrismaClient()
  if (req.method === 'GET') {
    const intId = parseInt(req.query.id as string)
    const matches = await prisma.match.findMany({
      take: parseInt(req.query.take as string),
      skip: parseInt(req.query.skip as string),
      where: {
        OR: [
          {
            player1_id: {
              equals: intId,
            },
          },
          {
            player2_id: {
              equals: intId,
            },
          },
        ],
      },
      include: {
        player_match_player1_idToplayer: true,
        player_match_player2_idToplayer: true,
        tournament: true,
      }
    })

    res.json(matches)
  }
}
