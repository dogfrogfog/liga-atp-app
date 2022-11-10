import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, player } from '@prisma/client'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<player[]>
) => {
  if (req.method === 'GET') {
    const searchPlayers = await prisma.player.findMany({
      where: {
        // add search by last_name as well
        first_name: {
          // remove case sensitivity
          contains: req.query.name as string,
        },
      },
      // return only latest version
      // include: { rankings_singles_current: true }
    })

    res.json(searchPlayers)
  }
}
