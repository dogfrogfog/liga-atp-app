import useSWR from 'swr';
import type { tournament as TournamentT } from '@prisma/client';

const useTournaments = () => {
  // из-за большого количества записей лагает чекбокс выбора активного турнира (чтобы изменить)
  const { data, isLoading, error, mutate } =
    useSWR<TournamentT[]>('/api/tournaments');

  return {
    tournaments: data || [],
    isLoading,
    error,
    mutate,
  };
};

export default useTournaments;
