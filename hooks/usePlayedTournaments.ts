import useSWR from 'swr';
import type {
  tournament as TournamentT,
  match as MatchT,
} from '@prisma/client';

const usePlayedTournaments = (page: number) => {
  const { data, isLoading, error, mutate } = useSWR<
    (TournamentT & { match: MatchT[] })[]
  >(`/api/tournaments/playedTournaments?page=${page}`);

  return {
    playedTournaments: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default usePlayedTournaments;
