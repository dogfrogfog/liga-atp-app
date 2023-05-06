import type { other_page as OtherPageT } from '@prisma/client';

export const usePageOrder = (otherPages: OtherPageT[]) => {
  const pageOrder = otherPages.length === 0 ? 1 : otherPages[otherPages.length - 1].order + 1;

  return {
    pageOrder,
  };
};

