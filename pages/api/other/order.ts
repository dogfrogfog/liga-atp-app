import type { NextApiRequest, NextApiResponse } from 'next';
import { other_page as OtherPageT } from '@prisma/client';

import { prisma } from 'services/db';

export default async (
  req: NextApiRequest,
  res: NextApiResponse<OtherPageT | OtherPageT[]>
) => {
  if (req.method === 'PUT') {
    const promiseArray: OtherPageT[] = [];
    const others: OtherPageT[] = req.body.data;
    others.forEach(async ({ id, order }) => {
        let updatedOtherPage = await prisma.other_page.update({
            where: {
              id,
            },
            data: {
              order
            },
          }); 
          promiseArray.push(updatedOtherPage);
    });

    const responses = await Promise.all(promiseArray);
    res.json(responses);
  }
};
