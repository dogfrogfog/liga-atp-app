import useSWR from 'swr';
import type { tournament as TournamentT } from '@prisma/client';

const useTournaments = () => {
  const { data, isLoading, error, mutate } =
    useSWR<TournamentT[]>('/api/tournaments');

  return {
    tournaments: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useTournaments;
