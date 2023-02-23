import type {
  match as MatchT,
  player as PlayerT,
  player_elo_ranking,
} from '@prisma/client';

type PlayerWithEloPoints = { id: number; elo_points: number };

const LEVEL_POINTS_DIFFERENCE = 200;
const NO_POINTS_DIFFERENCE = 50;
const POINTS_FOR_PLAYED_MATCH = 1;

const COEF_MATCH_VS_HIGHER_LEVEL = 1;
const DEFAULT_K_FACTOR = 32;
const TWO_SETS_MATCH_SCORE_LENGTH = 7;
const COEF_STRAIGHT_SETS = 1;

const getPlayersKFactor = (
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

const getWinProbability = (p1EloPoints: number, p2EloPoints: number) => {
  return 1 / (1 + Math.pow(1 + 10, (p2EloPoints - p1EloPoints) / 250));
};

const getNewEloAfterMatch = (
  matchRecord: MatchT,
  matchesPlayed: {
    p1: MatchT[];
    p2: MatchT[];
    p3?: MatchT[];
    p4?: MatchT[];
  },
  [p1, p2, p3, p4]: player_elo_ranking[]
) => {
  const isDoubles = matchRecord.player3_id && matchRecord.player4_id;
  // if players has no points -> set initial points

  // should be default values by level
  // but we assume that when new player created -> we create elo points record with id
  // need to make sure table in db is matching this
  const p1Points = (p1.elo_points as number) || 0;
  const p2Points = (p1.elo_points as number) || 0;
  const p3Points = (p1.elo_points as number) || 0;
  const p4Points = (p1.elo_points as number) || 0;

  // def setInitialPointsByLevel():
  // pointsForLevel = InitialPoints

  // for level in Levels:
  //   InitPointsByLevelDict[level] = pointsForLevel
  // pointsForLevel += LevelPointsDifference

  const inStraightSets =
    (matchRecord.score || '').length === TWO_SETS_MATCH_SCORE_LENGTH;
  const p1IsWinner = parseInt(matchRecord.winner_id as string, 10) === p1.id;

  // not used
  // const levelDiff = (p1.level as number) - (p2.level as number);
  // const coefHigherLevel = COEF_MATCH_VS_HIGHER_LEVEL ** levelDiff;

  const { kFactorP1, kFactorP2 } = getPlayersKFactor(
    matchesPlayed.p1.length,
    matchesPlayed.p2.length
  );
  const pointsDiff = Math.abs(p1Points - p2Points);
  const coefMatchResult = inStraightSets ? COEF_STRAIGHT_SETS : 1;

  const probabilityP1Wins = getWinProbability(p1Points, p2Points);
  const pointsDeltaP1 = coefMatchResult * kFactorP1 * probabilityP1Wins;
  const pointsDeltaP2 = coefMatchResult * kFactorP2 * (1 - probabilityP1Wins);

  let changedEloPointsP1 = p1Points;
  let changedEloPointsP2 = p2Points;
  if (p1IsWinner) {
    if (pointsDiff <= NO_POINTS_DIFFERENCE) {
      changedEloPointsP1 += pointsDeltaP1;
      changedEloPointsP2 -= pointsDeltaP2;
    }

    // if there is a points difference
    // what do we do ?
  } else {
    if (pointsDiff <= NO_POINTS_DIFFERENCE) {
      changedEloPointsP2 += pointsDeltaP1;
      changedEloPointsP1 -= pointsDeltaP2;
    }

    // if there is a points difference
    // what do we do ?
  }

  changedEloPointsP1 += POINTS_FOR_PLAYED_MATCH;
  changedEloPointsP2 += POINTS_FOR_PLAYED_MATCH;
  let changedEloPointsP3 = POINTS_FOR_PLAYED_MATCH;
  let changedEloPointsP4 = POINTS_FOR_PLAYED_MATCH;

  return {
    changedEloPointsP1: Math.round(changedEloPointsP1),
    changedEloPointsP2: Math.round(changedEloPointsP2),
    ...(changedEloPointsP3 && changedEloPointsP4
      ? {
          changedEloPointsP3: Math.round(changedEloPointsP3),
          changedEloPointsP4: Math.round(changedEloPointsP4),
        }
      : {}),
  };
};

export default getNewEloAfterMatch;
