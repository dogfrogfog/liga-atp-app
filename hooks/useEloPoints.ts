import useSWR from 'swr';
import type { player_elo_ranking as PlayerEloRankingT } from '@prisma/client';

const useEloPoints = () => {
  const { data, isLoading, error, mutate } =
    useSWR<PlayerEloRankingT[]>('/api/ranking/all');

  return {
    eloPoints: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useEloPoints;
