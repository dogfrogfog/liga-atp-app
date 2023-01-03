import type { match as MatchT } from '@prisma/client';

export const calculateMatchesForP1Score = (matches: MatchT[]) => {
  let wins = 0;
  let loses = 0;

  matches.forEach((m) => {
    if (m.player1_id === parseInt(m.winner_id as string, 10)) {
      wins += 1;
    } else {
      loses += 1;
    }
  });

  return `${wins} VS ${loses}`;
};
