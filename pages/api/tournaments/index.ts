import type { NextApiRequest, NextApiResponse } from 'next';
import {
  Prisma,
  PrismaClient,
  tournament as TournamentT,
} from '@prisma/client';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TournamentT[] | TournamentT | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const paginatedTournaments = await prisma.tournament.findMany({
      take: parseInt(req.query.take as string),
      skip: parseInt(req.query.skip as string),
      orderBy: {
        id: 'desc',
      },
    });

    res.json(paginatedTournaments);
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
        id: req.body.data,
      },
    });

    res.json(deletedTournaments);
  }

  if (req.method === 'PUT') {
    const updatedTournament = await prisma.tournament.update({
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
