import useSWR from 'swr';
import type { tournament as TournamentT } from '@prisma/client';

const usePlayedTournamnts = (page: number) => {
  const { data, isLoading, error, mutate } = useSWR<TournamentT[]>(
    `/api/tournaments/playedTournaments?page=${page}`
  );

  return {
    playedTournaments: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default usePlayedTournamnts;
