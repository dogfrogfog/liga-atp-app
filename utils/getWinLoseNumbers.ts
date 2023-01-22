import type { MatchWithTournamentType } from 'utils/getOpponents';
import { isPlayerWon } from 'utils/isPlayerWon';

export const getWinLoseNumbers = (
  playerId: number,
  matches: MatchWithTournamentType[]
): { wins: number; losses: number } => {
  const { wins, losses } = matches.reduce(
    (acc, m) => {
      const isWinner = isPlayerWon(playerId, m);

      if (isWinner) {
        acc.wins += 1;
      } else {
        acc.losses += 1;
      }

      return acc;
    },
    { wins: 0, losses: 0 }
  );

  return { wins, losses };
};
