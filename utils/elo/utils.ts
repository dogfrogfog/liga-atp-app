const DEFAULT_K_FACTOR = 32;
const K_FACTOR_IS_DYNAMIC = false;

export const getPlayersKFactor = (
  matchesPlayedP1: number,
  matchesPlayedP2: number
) => {
  let kFactorP1 = DEFAULT_K_FACTOR;
  let kFactorP2 = DEFAULT_K_FACTOR;
  if (K_FACTOR_IS_DYNAMIC) {
    kFactorP1 = matchesPlayedP1
      ? 250 / (matchesPlayedP1 + 5) ** 0.4
      : DEFAULT_K_FACTOR;
    kFactorP2 = matchesPlayedP2
      ? 250 / (matchesPlayedP2 + 5) ** 0.4
      : DEFAULT_K_FACTOR;
  }

  return { kFactorP1, kFactorP2 };
};

export const getWinProbability = (
  team1EloPoints: number,
  team2EloPoints: number
) => {
  return 1 / (1 + Math.pow(10, (team2EloPoints - team1EloPoints) / 250));
};

export const getMatchResultCoef = (score: string) => {
  const { p1Sets, p2Sets, isMatchCompleted, validSets } = parseScore(score);
  const setsAbs = Math.abs(p1Sets.length - p2Sets.length);

  let coef = 1;

  if (isMatchCompleted && setsAbs === 1) {
    coef = 1 / 1.6;
  } else if (isMatchCompleted && validSets.length > 3 && setsAbs === 2) {
    coef = 1 / 1.5;
  }

  return coef;
};

const parseScore = (score: string) => {
  let isValidMatch = true;
  let isValidTiebreak = true;
  let isMatchCompleted = false;
  let isTiebreakCompleted = false;
  let isScoreEmpty = true;
  const validSets = [] as any[];
  const p1Sets = [] as any[];
  const p2Sets = [] as any;
  let p1GamesBalance = 0;
  let p2GamesBalance = 0;
  let raw = '';
  let rawReverse = '';
  const messages = [];

  const reverse = [] as any[];

  if (!score && score.trim() === '') {
    isValidMatch = false;
    isValidTiebreak = false;
  }

  const sets = score.split(' ');
  let hasShortSets = false;

  if (sets.length > 3) {
    hasShortSets = true;
  }

  // # STEP 1
  for (const setString of sets) {
    let p1Points = 0;
    let p2Points = 0;

    if (!isValidMatch && !isValidTiebreak) {
      continue;
    }

    if (validSets.length > 0) {
      isValidTiebreak = false;

      if (p1Sets.length === 0 && p2Sets.length === 0) {
        isValidMatch = false;
      }
    }

    const isFirstSet = p1Sets.length === 0 && p2Sets.length === 0;
    const splitPoints = setString.split('-').filter((x) => /^\d\d?$/.test(x));

    if (splitPoints.length !== 2) {
      isValidMatch = false;
      isValidTiebreak = false;
      console.error('split point not equal 2 or illegal');
      reverse.push(setString);
    } else {
      p1Points = parseInt(splitPoints[0], 10);
      p2Points = parseInt(splitPoints[1], 10);

      if (
        ((p1Points > 7 ||
          (p1Points === 7 && p2Points < 5) ||
          p2Points > 7 ||
          (p2Points === 7 && p1Points < 5)) &&
          validSets.length < 2) ||
        (p1Sets.length === 2 && !hasShortSets) ||
        p1Sets.length === 3 ||
        (p2Sets.length === 2 && !hasShortSets) ||
        p2Sets.length === 3 ||
        (hasShortSets && (p1Points > 4 || p2Points > 4))
      ) {
        isValidMatch = false;
      }

      validSets.push(setString);
      isScoreEmpty = false;
      reverse.push(splitPoints[1] + '-' + splitPoints[0]);

      if (
        (p1Points === 6 && p2Points < 5) ||
        (p1Points === 7 && (p2Points === 5 || p2Points === 6))
      ) {
        p1Sets.push(setString);
        p1GamesBalance += p1Points - p2Points;
        p2GamesBalance += p2Points - p1Points;
      } else if (
        (p2Points === 6 && p1Points < 5) ||
        (p2Points === 7 && (p1Points === 5 || p1Points === 6))
      ) {
        p2Sets.push(setString);
        p1GamesBalance += p1Points - p2Points;
        p2GamesBalance += p2Points - p1Points;
      } else if (p1Points >= 10 && p1Points - p2Points >= 2) {
        p1Sets.push(setString);
        p1GamesBalance += 1;
        p2GamesBalance += -1;
      } else if (p2Points >= 10 && p2Points - p1Points >= 2) {
        p2Sets.push(setString);
        p1GamesBalance += -1;
        p2GamesBalance += 1;
      } else if (
        p1Points === 4 &&
        p2Points < 4 &&
        (isFirstSet || hasShortSets)
      ) {
        hasShortSets = true;
        p1Sets.push(setString);
        p1GamesBalance += p1Points - p2Points;
        p2GamesBalance -= p1Points - p2Points;
      } else if (
        p2Points === 4 &&
        p1Points < 4 &&
        (isFirstSet || hasShortSets)
      ) {
        hasShortSets = true;
        p2Sets.push(setString);
        p1GamesBalance += p1Points - p2Points;
        p2GamesBalance -= p1Points - p2Points;
      }
    }
  }

  // # STEP 2
  if (isValidMatch && p1Sets.length + p2Sets.length === validSets.length) {
    // common match
    if (
      [2, 3].includes(validSets.length) &&
      !hasShortSets &&
      (p1Sets.length === 2 || p2Sets.length === 2)
    ) {
      isMatchCompleted = true;
      // 5 set match with 4 points sets
    } else if (
      [3, 4, 5].includes(validSets.length) &&
      hasShortSets &&
      (p1Sets.length === 3 || p2Sets.length === 3)
    ) {
      isMatchCompleted = true;
    } else if (
      isValidTiebreak &&
      validSets.length === 1 &&
      p1Sets.length + p2Sets.length === 1
    ) {
      isTiebreakCompleted = true;
    }
  }

  return { p1Sets, p2Sets, isMatchCompleted, validSets };
};
