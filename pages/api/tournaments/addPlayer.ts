import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, tournament as TournamentT } from '@prisma/client';

const prisma = new PrismaClient();

export default async (
  req: NextApiRequest,
  res: NextApiResponse<TournamentT>
) => {
  if (req.method === 'POST') {
    const { id, ...dataToUpdate } = req.body.data;
    const updatedTournament = await prisma.tournament.update({
      where: {
        id: id,
      },
      data: dataToUpdate,
    });

    res.json(updatedTournament);
  }
};
