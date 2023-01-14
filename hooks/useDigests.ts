import useSWR from 'swr';
import type { digest as DigestT } from '@prisma/client';

const useDigests = () => {
  const { data, isLoading, error, mutate } = useSWR<DigestT[]>('/api/digests');

  return {
    digests: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useDigests;
