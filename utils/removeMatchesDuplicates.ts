import type { match as MatchT } from '@prisma/client';

import type { MatchWithTournamentType } from 'utils/getOpponents';

const removeMatchesDuplicates = (
  matches: (MatchT | MatchWithTournamentType)[]
): any[] => {
  const matchesIds = new Set();
  const matchesWithoutDuplicates = [];

  for (const match of matches) {
    if (!matchesIds.has(match.id)) {
      matchesIds.add(match.id);
      matchesWithoutDuplicates.push(match);
    }
  }

  return matchesWithoutDuplicates;
};

export default removeMatchesDuplicates;
