import useSWR from 'swr';
import type { digest as DigestT } from '@prisma/client';

const useDigests = (page?: number) => {
  const { data, isLoading, error, mutate } = useSWR<DigestT[]>(
    `/api/digests${page ? `?page=${page}` : ''}`
  );

  return {
    digests: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useDigests;
