import useSWR from 'swr';
import type { player_elo_ranking as PlayerEloRankingT } from '@prisma/client';

const useActivePlayersRankings = () => {
  const { data, isLoading, error, mutate } = useSWR<PlayerEloRankingT[]>(
    '/api/ranking/points'
  );

  return {
    playersRankings: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useActivePlayersRankings;
