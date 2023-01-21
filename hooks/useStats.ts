import useSWR from 'swr';

import type { StatsDataType } from 'pages/api/stats';

const useStats = (id: number, tournament_type?: number) => {
  const { data, isLoading, error } = useSWR<StatsDataType>(
    `/api/stats?id=${id}${
      tournament_type ? `&tournament_type=${tournament_type}` : ''
    }`
  );

  return {
    statsData: data || {},
    isLoading,
    error,
  };
};

export default useStats;
