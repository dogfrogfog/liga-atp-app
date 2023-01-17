import type { NextApiRequest, NextApiResponse } from 'next';
import { digest as DigestT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<DigestT[] | DigestT>
) => {
  if (req.method === 'GET') {
    const digests = await prisma.digest.findMany();

    res.json(digests);
  }
};
