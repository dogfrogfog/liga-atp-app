// eslint-disable import/no-anonymous-default-export
import type { NextApiRequest, NextApiResponse } from 'next';
import { match as MatchT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<MatchT[] | MatchT>
) => {
  if (req.method === 'GET') {
    const tournamentId = parseInt(req.query.tournamentId as string, 10);
    const playerId = parseInt(req.query.playerId as string, 10);

    console.log(tournamentId)

    if (!playerId || !tournamentId) {
      res.status(404);
    }

    let matches: MatchT[] = [];

    if (tournamentId) {
      matches = await prisma.match.findMany({
        where: {
          tournament_id: {
            equals: tournamentId,
          },
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
    }

    if (playerId) {
      matches = await prisma.match.findMany({
        where: {
          OR: [
            {
              player1_id: {
                equals: playerId,
              },
            },
            {
              player2_id: {
                equals: playerId,
              },
            },
            {
              player3_id: {
                equals: playerId,
              },
            },
            {
              player4_id: {
                equals: playerId,
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
    }

    console.log(matches)

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
