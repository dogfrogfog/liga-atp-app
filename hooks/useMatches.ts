import useSWR from 'swr';

import type { MatchWithTournamentType } from 'utils/getOpponents';

const useMatches = (playerId: number, level?: number) => {
  const { data, isLoading, error, mutate } = useSWR<MatchWithTournamentType[]>(
    `/api/matches?id=${playerId}${level ? `&level=${level}` : ''}`
  );

  return {
    matches: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useMatches;
