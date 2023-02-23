const DEFAULT_K_FACTOR = 32;

export const getPlayersKFactor = (
  matchesPlayedP1: number,
  matchesPlayedP2: number
) => {
  const kFactorP1 = matchesPlayedP1
    ? 250 / (matchesPlayedP1 + 5) ** 0.4
    : DEFAULT_K_FACTOR;
  const kFactorP2 = matchesPlayedP2
    ? 250 / (matchesPlayedP2 + 5) ** 0.4
    : DEFAULT_K_FACTOR;

  return { kFactorP1, kFactorP2 };
};

export const getWinProbability = (
  team1EloPoints: number,
  team2EloPoints: number
) => {
  return 1 / (1 + Math.pow(1 + 10, (team2EloPoints - team1EloPoints) / 250));
};

export const getMatchResultCoef = (score: string) => {
  let coef = 1;
  return coef;

  // todo: implement this
};

