import type { NextApiRequest, NextApiResponse } from 'next';
import { other_page as OtherPageT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<OtherPageT>
) => {
  console.log(req.body.data);
  if (req.method === 'POST') {
    const { data } = req.body;
    const createdPage = await prisma.other_page.create({
      data,
    });

    res.json(createdPage);
  }
};
