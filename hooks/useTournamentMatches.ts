import useSWR from 'swr';
import { match as MatchT } from '@prisma/client';

const useTournamentMatches = (tournamentId: number) => {
  const { data, isLoading, error, mutate } = useSWR<MatchT[]>(
    `/api/matches?tournamentId=${tournamentId}`
  );

  return {
    matches: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useTournamentMatches;
