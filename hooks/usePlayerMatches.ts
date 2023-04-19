import useSWR from 'swr';

import type { MatchWithTournamentType } from 'utils/getOpponents';

const usePlayerMatches = (playerId: number) => {
  const { data, isLoading, error, mutate } = useSWR<MatchWithTournamentType[]>(
    `/api/matches?playerId=${playerId}`
  );

  return {
    matches: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default usePlayerMatches;
