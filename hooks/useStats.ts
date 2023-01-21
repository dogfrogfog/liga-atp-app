import useSWR from 'swr';

import type { StatsDataType } from 'pages/api/stats';

const usePlayers = (id: number, level?: number) => {
  const { data, isLoading, error } = useSWR<StatsDataType>(
    `/api/stats?id=${id}${level ? `&level=${level}` : ''}`
  );

  return {
    statsData: data || {},
    isLoading,
    error,
  };
};

export default usePlayers;
