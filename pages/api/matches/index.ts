import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, core_match } from '@prisma/client'


export default async (
  req: NextApiRequest,
  res: NextApiResponse<core_match[]>
) => {
  const prisma = new PrismaClient()
  if (req.method === 'GET') {
    const intId = parseInt(req.query.id as string)
    const matches = await prisma.core_match.findMany({
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
        core_player_core_match_player1_idTocore_player: true,
        core_player_core_match_player2_idTocore_player: true,
        core_tournament: true,
      }
    })

    res.json(matches)
  }
}
