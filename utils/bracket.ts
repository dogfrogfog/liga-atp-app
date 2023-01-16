import type { match as MatchT } from '@prisma/client';

import { DRAW_TYPE_NUMBER_VALUES } from 'constants/draw';

export const getInitialBrackets = (drawType: number) => {
  const { totalStages, firstStageMatches, withQual, groups } =
    DRAW_TYPE_NUMBER_VALUES[drawType];
  let stageMatches = firstStageMatches;

  let result: MatchT[][];

  if (groups) {
    // fill first round with groups
    result = [new Array(groups).fill([])];

    for (let i = 1; i < totalStages; i += 1) {
      result.push(Array(stageMatches).fill({}));
      stageMatches = stageMatches / 2;
    }
  } else {
    result = withQual ? [Array(stageMatches).fill({})] : [];
    for (let i = 0; i < totalStages; i += 1) {
      result.push(Array(stageMatches).fill({}));
      stageMatches = stageMatches / 2;
    }
  }

  return result;
};
