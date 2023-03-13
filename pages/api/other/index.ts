import type { NextApiRequest, NextApiResponse } from 'next';
import { other_page as OtherPageT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<OtherPageT | OtherPageT[]>
) => {
  if (req.method === 'GET') {
    const othePages = await prisma.other_page.findMany();

    res.json(othePages);
  }

  if (req.method === 'PUT') {
    const { id, markdown, title, slug } = req.body.data;
    const updatedOthePage = await prisma.other_page.update({
      where: {
        id,
      },
      data: {
        markdown,
        title,
        slug,
      },
    });

    res.json(updatedOthePage);
  }

  if (req.method === 'DELETE') {
    await prisma.other_page.delete({
      where: {
        id: parseInt(req.body, 10),
      },
    });

    res.end();
  }
};
