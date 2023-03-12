import type { NextApiRequest, NextApiResponse } from 'next';
import { other_page as OtherPageT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (req: NextApiRequest, res: NextApiResponse<OtherPageT | OtherPageT[]>) => {
  if (req.method === 'GET') {
    const othePages = await prisma.other_page.findMany();

    res.json(othePages);
  }
};
