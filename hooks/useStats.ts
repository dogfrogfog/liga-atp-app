import useSWR from 'swr';

import type { StatsDataType } from 'pages/api/stats';

const useStats = (id?: number, tournament_type?: number) => {
  const { data, isLoading, error } = useSWR<StatsDataType>(
    id
      ? `/api/stats?id=${id}${
          tournament_type !== undefined
            ? `&tournament_type=${tournament_type}`
            : ''
        }`
      : null
  );

  return {
    statsData: data || {},
    isLoading,
    error,
  };
};

export default useStats;
