import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, tournament as TournamentT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TournamentT[] | TournamentT | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const shouldIncludePlayedTournaments = !!req.query.withPlayed;

    const additionalParams = !shouldIncludePlayedTournaments
      ? {
          where: {
            status: {
              in: [1, 2],
            },
          },
        }
      : null;

    const tournaments = await prisma.tournament.findMany({
      orderBy: {
        id: 'desc',
      },
      ...additionalParams,
    });

    res.json(tournaments);
  }

  if (req.method === 'POST') {
    const createdTournament = await prisma.tournament.create({
      data: req.body.data,
    });

    res.json(createdTournament);
  }

  if (req.method === 'DELETE') {
    const deletedTournaments = await prisma.tournament.delete({
      where: {
        id: parseInt(req.body, 10),
      },
    });

    res.end();
  }

  if (req.method === 'PUT') {
    await prisma.tournament.update({
      where: {
        id: req.body.data.id,
      },
      data: req.body.data,
    });

    const updatedTournamentFull = await prisma.tournament.findUnique({
      where: {
        id: req.body.data.id,
      },
      include: {
        match: {
          include: {
            player_match_player1_idToplayer: true,
            player_match_player2_idToplayer: true,
            player_match_player3_idToplayer: true,
            player_match_player4_idToplayer: true,
          },
        },
      },
    });

    res.json(updatedTournamentFull as TournamentT);
  }
};
