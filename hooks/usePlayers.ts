import useSWR from 'swr';
import type { player as PlayerT } from '@prisma/client';

const usePlayers = (page?: number) => {
  const { data, isLoading, error, mutate } = useSWR<PlayerT[]>(
    `/api/players${page ? `?page=${page}` : ''}`
  );

  return {
    players: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default usePlayers;
