import type { NextApiRequest, NextApiResponse } from 'next';
import { digest as DigestT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<DigestT[] | DigestT>
) => {
  if (req.method === 'POST') {
    const newDigest = await prisma.digest.create({
      data: req.body.data,
    });

    res.json(newDigest);
  }
};
