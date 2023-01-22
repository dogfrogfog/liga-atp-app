import type { match as MatchT, tournament as Tournament } from '@prisma/client';

export const isMatchPlayed = (match: MatchT & { tournament: Tournament }) => {
  // all posible variations of played match/finished tournament
  return !!(
    (match.winner_id && (match.score || match.comment)) ||
    match.is_completed === true ||
    match.tournament?.is_finished ||
    match.tournament?.status === 3
  );
};
