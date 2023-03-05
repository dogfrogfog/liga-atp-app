import type { NextApiRequest, NextApiResponse } from 'next';
import { Prisma, player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';

import playerJson from './core_player.json';
import core_tournament from './core_tournament.json';
import matches from './core_match.json';
import elo from './elo2.json';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<PlayerT[] | PlayerT | Prisma.BatchPayload>
) => {
  if (req.method === 'GET') {
    const players = await prisma.player.findMany();

    let pEloMap = new Map();
    for (const eloRec of elo) {
      pEloMap.set(eloRec.pid, eloRec);
    }

    let notHidden = 0;
    let wd = 0;
    const nd = new Date();

    const data = players.map((v) => {
      const eloRecord = pEloMap.get(v.id);

      let exp;
      if (!eloRecord || eloRecord?.isHidden === true) {
        exp = new Date(new Date('2022-03-04'));
      }

      if (eloRecord?.isHidden === false) {
        notHidden++;

        exp = eloRecord?.last_match
          ? new Date(
            new Date(eloRecord.last_match).getTime() +
            1000 * 60 * 60 * 24 * 30 * 6
          )
          : new Date(nd.getTime() + 1000 * 60 * 60 * 24 * 30 * 6);
      }

      return {
        elo_points: eloRecord?.elo || (1100 + (v.level || 0) * 200),
        player_id: v.id,
        expire_date: exp,
      };
    });

    console.log(players.length)

    await prisma.player_elo_ranking.createMany({
      data,
    });

    res.status(200).json({});
  }
};
