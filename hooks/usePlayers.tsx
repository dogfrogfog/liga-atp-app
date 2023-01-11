import useSWR from 'swr';
import type { player as PlayerT } from '@prisma/client';

const usePlayers = () => {
  const { data, isLoading, error, mutate } = useSWR<PlayerT[]>('/api/players');

  return {
    players: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default usePlayers;
