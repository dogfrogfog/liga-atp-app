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
          skip: page > 1 ? page * DIGEST_PAGE_SIZE : 0,
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
};
