const D8 = {
  firstStageMatches: 4,
  totalStages: 3,
};
const D16 = {
  firstStageMatches: 8,
  totalStages: 4,
};
const D32 = {
  firstStageMatches: 16,
  totalStages: 5,
};
const D64 = {
  firstStageMatches: 32,
  totalStages: 6,
};
const G6 = {
  groups: 1,
  groupSize: 6,
  totalStages: 3,
  firstStageMatches: 2, // after group stage
};
const G8 = {
  groups: 2,
  groupSize: 4,
  totalStages: 3,
  firstStageMatches: 2, // after group stage
};
const G10 = {
  groups: 2,
  groupSize: 5,
  totalStages: 3,
  firstStageMatches: 2, // after group stage
};
const G12 = {
  groups: 4,
  groupSize: 3,
  totalStages: 4,
  firstStageMatches: 4, // after group stage
};
const G16 = {
  groups: 4,
  groupSize: 4,
  totalStages: 4,
  firstStageMatches: 4, // after group stage
};

export const DRAW_TYPE_NUMBER_VALUES: any = {
  10: D8,
  3: D16,
  1: D32,
  12: D64,
  11: {
    ...D8,
    withQual: true,
  },
  4: {
    ...D16,
    withQual: true,
  },
  2: {
    ...D32,
    withQual: true,
  },
  13: {
    ...D64,
    withQual: true,
  },
  14: G6,
  15: G8,
  16: G10,
  17: G12,
  18: G16,
};
