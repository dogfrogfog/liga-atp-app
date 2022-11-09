import type { NextApiRequest, NextApiResponse } from 'next'
import { Prisma, PrismaClient, tournament as TournamentT } from '@prisma/client'

const prisma = new PrismaClient()

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TournamentT[] | TournamentT | Prisma.BatchPayload>,
) => {
  if (req.method === 'GET') {
    const paginatedTournaments = await prisma.tournament.findMany({
      take: parseInt(req.query.take as string),
      skip: parseInt(req.query.skip as string),
    });

    res.json(paginatedTournaments);
  }

  if (req.method === 'POST') {
    const createdTournament = await prisma.tournament.create({
      data: req.body.data,
    });

    res.json(createdTournament);
  }

  // todo: fix
  if (req.method === 'DELETE') {
    // const deletedTournaments = await prisma.tournament.deleteMany({
    //   where: {
    //     id: {
    //       // todo: add multiple delete operation
    //       equals: req.body[0],
    //     },
    //   },
    // });

    // res.json(deletedTournaments);
  }

  if (req.method === 'PUT') {
    const updatedTournament = await prisma.tournament.update({
      where: {
        id: req.body.data.id,
      },
      data: req.body.data,
    });

    res.json(updatedTournament);
  }
}
