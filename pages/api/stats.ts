import type { NextApiRequest, NextApiResponse } from 'next';
import { player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';

// should return stats for single player+ for two players if it's h2h page
export default async (req: NextApiRequest, res: NextApiResponse<PlayerT[]>) => {
  if (req.method === 'GET') {
    const { player1Id, player2Id } = req.query;

    // const h2hPlayers = await prisma.player.findMany({
    //   where: {
    //     id: {
    //       in: [
    //         parseInt(player1Id as string, 10),
    //         parseInt(player2Id as string, 10),
    //       ],
    //     },
    //   },
    // });

    res.json({} as any);
  }
};
