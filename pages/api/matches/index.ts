// eslint-disable import/no-anonymous-default-export
import type { NextApiRequest, NextApiResponse } from 'next';
import { match as MatchT } from '@prisma/client';

import { prisma } from 'services/db';
import getPlayersChangedEloPoins from 'utils/elo/getPlayersChangedEloPoins';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<MatchT[] | MatchT>
) => {
  if (req.method === 'GET') {
    const intId = parseInt(req.query.id as string, 10);

    if (!intId) {
      res.status(404);
    }

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
      data: {
        ...req.body.data,
        time: req.body.data?.time
          ? new Date(req.body.data?.time).toISOString()
          : null,
      },
    });

    res.json(createdMatch);
  }

  if (req.method === 'PUT') {
    const { id, time, ...matchData } = req.body.data;

    const updatedMatch = await prisma.match.update({
      where: {
        id,
      },
      data: {
        ...matchData,
        time: time ? new Date(time).toISOString() : null,
      },
    });

    res.json(updatedMatch);
  }
};
