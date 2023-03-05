import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, player as PlayerT } from '@prisma/client';

import { PLAYERS_PAGE_SIZE } from 'constants/values';
import { prisma } from 'services/db';

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomPick = (values: string[]) => {
  const index = Math.floor(Math.random() * values.length);
  return values[index];
};

export default async (
  req: NextApiRequest,
  res: NextApiResponse<PlayerT[] | PlayerT | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const itemCount = await prisma.player.count();

    const orderBy = randomPick([
      'id',
      'first_name',
      'last_name',
      'level',
      'technique',
      'tactics',
      'power',
      'shakes',
      'serve',
      'behaviour',
    ]);
    const orderDir = randomPick(['asc', 'desc']);

    let players = await prisma.player.findMany({
      orderBy: { [orderBy]: orderDir },
      take: PLAYERS_PAGE_SIZE,
      skip: randomNumber(0, itemCount - 1),
    });

    let playersElo = await prisma.player_elo_ranking.findMany();

    const playersEloMap = playersElo.reduce((acc, playerElo) => {
      acc.set(playerElo.player_id as number, playerElo.elo_points as number);
      return acc;
    }, new Map<number, number>());

    res.json(
      players.map((p) => ({ ...p, elo_points: playersEloMap.get(p.id) }))
    );
  }
};
