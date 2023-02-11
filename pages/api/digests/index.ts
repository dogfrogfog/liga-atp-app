import type { NextApiRequest, NextApiResponse } from 'next';
import { digest as DigestT } from '@prisma/client';

import { prisma } from 'services/db';
import { DIGEST_PAGE_SIZE } from 'constants/values';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<DigestT[] | DigestT>
) => {
  if (req.method === 'GET') {
    const page = parseInt(req.query.page as string, 10);
    const paginationParams = page
      ? {
          skip: (page - 1) * DIGEST_PAGE_SIZE,
          take: DIGEST_PAGE_SIZE,
        }
      : undefined;

    const digests = await prisma.digest.findMany({
      orderBy: {
        id: 'desc',
      },
      ...paginationParams,
    });

    res.json(digests);
  }

  if (req.method === 'PUT') {
    const updatedDigest = await prisma.digest.update({
      where: {
        id: req.body.data.id,
      },
      data: req.body.data,
    });

    res.json(updatedDigest);
  }

  if (req.method === 'DELETE') {
    await prisma.digest.delete({
      where: {
        id: parseInt(req.body, 10),
      },
    });

    res.end();
  }
};
