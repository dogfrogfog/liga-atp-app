// eslint-disable import/no-anonymous-default-export
import type { NextApiRequest, NextApiResponse } from 'next';
import { match as MatchT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<MatchT[] | MatchT>
) => {
  if (req.method === 'GET') {
    const intId = parseInt(req.query.id as string, 10);

    const matches = await prisma.match.findMany({
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
          {
            player3_id: {
              equals: intId,
            },
          },
          {
            player4_id: {
              equals: intId,
            },
          },
        ],
      },
      include: {
        player_match_player1_idToplayer: true,
        player_match_player2_idToplayer: true,
        player_match_player3_idToplayer: true,
        player_match_player4_idToplayer: true,
        tournament: true,
      },
      orderBy: {
        id: 'desc',
      },
    });

    res.json(matches);
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
};
