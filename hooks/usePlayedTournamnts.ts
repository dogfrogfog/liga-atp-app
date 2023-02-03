import useSWR from 'swr';
import type { tournament as TournamentT } from '@prisma/client';

const usePlayedTournamnts = () => {
  const { data, isLoading, error, mutate } = useSWR<TournamentT[]>(
    '/api/tournaments/playedTournaments'
  );

  return {
    playedTournaments: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default usePlayedTournamnts;
