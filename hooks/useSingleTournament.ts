import useSWR from 'swr';
import type {
  tournament as TournamentT,
  match as MatchT,
} from '@prisma/client';

const useSingleTournament = (
  id: number,
  initialData: TournamentT & { match: MatchT[] }
) => {
  const { data, error, mutate } = useSWR(`/api/tournaments/single?id=${id}`, {
    fallbackData: initialData,
  });

  return {
    tournament: data,
    error,
    mutate,
  };
};

export default useSingleTournament;
