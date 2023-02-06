import type { NextApiRequest, NextApiResponse } from 'next';
import { other_pages as OtherPage } from '@prisma/client';

import { prisma } from 'services/db';

export default async (req: NextApiRequest, res: NextApiResponse<OtherPage>) => {
  if (req.method === 'PUT') {
    const { id, ...dataToUpdate } = req.body.data;
    const updatedOthePage = await prisma.other_pages.update({
      where: {
        id,
      },
      data: dataToUpdate,
    });

    res.json(updatedOthePage);
  }
};
