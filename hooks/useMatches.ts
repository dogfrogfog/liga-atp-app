import useSWR from 'swr';

import type { MatchWithTournamentType } from 'utils/getOpponents';

const useMatches = (playerId: number) => {
  const { data, isLoading, error, mutate } = useSWR<MatchWithTournamentType[]>(
    playerId ? `/api/matches?id=${playerId}` : null
  );

  return {
    matches: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useMatches;
