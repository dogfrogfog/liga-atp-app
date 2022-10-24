import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, core_player } from '@prisma/client'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<core_player[]>
) => {
  if (req.method === 'GET') {
    const searchPlayers = await prisma.core_player.findMany({
      where: {
        // add search by last_name as well
        first_name: {
          // remove case sensitivity
          contains: req.query.name as string,
        },
      },
      // return only latest version
      include: { core_rankingssinglescurrent: true }
    })

    res.json(searchPlayers)
  }
}
