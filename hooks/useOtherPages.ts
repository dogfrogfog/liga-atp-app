import useSWR from 'swr';
import type { other_page as OtherPageT } from '@prisma/client';

const useOtherPages = () => {
  const { data, isLoading, error, mutate } = useSWR<OtherPageT[]>('/api/other');

  return {
    otherPages: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useOtherPages;
