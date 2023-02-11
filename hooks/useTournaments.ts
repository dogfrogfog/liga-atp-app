import useSWR from 'swr';
import type { tournament as TournamentT } from '@prisma/client';

// should includes played tournaments
const useTournaments = (withPlayed = true) => {
  const { data, isLoading, error, mutate } = useSWR<TournamentT[]>(
    `/api/tournaments${withPlayed ? '?withPlayed=true' : ''}`
  );

  return {
    tournaments: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useTournaments;
