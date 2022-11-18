export const D8 = {
  firstStageMatches: 4,
};

export const D16 = {
  firstStageMatches: 8,
};

export const D32 = {
  firstStageMatches: 16,
};

export const D64 = {
  firstStageMatches: 32,
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
  }, // new

  14: {},
  15: {},
  16: {},
  17: {},
  18: {},
}

// const Q8

