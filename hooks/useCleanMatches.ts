import useSWR from 'swr';
import type { player as PlayerT } from '@prisma/client';

const useCleanMatches = () => {
  const { data, isLoading, error, mutate } = useSWR<PlayerT[]>('/api/matches');

  return {
    matches: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useCleanMatches;
