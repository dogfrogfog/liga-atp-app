// eslint-disable import/no-anonymous-default-export
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, match } from '@prisma/client'


export default async (
  req: NextApiRequest,
  res: NextApiResponse<match[] | match>
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

  if (req.method === 'POST') {
    const createdMatch = await prisma.match.create({
      data: req.body.data,
    });

    res.json(createdMatch);
  }

  if (req.method === 'PUT') {
    const updatedMatch = await prisma.match.update({
      where: {
        id: req.body.data.id,
      },
      data: req.body.data,
    });

    res.json(updatedMatch);
  }
}
