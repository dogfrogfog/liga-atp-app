// interface NumberValuesT {
//   [k: number | string]: number;
// }
// todo: add types objects

export const LEVEL_NUMBER_VALUES: any = {
  4: 'leger',
  3: 'pro',
  2: 'masters',
  1: 'challenger',
  0: 'futures',
  '-1': 'Satellite', // todo: change index, reorder indexes
};

export const TOURNAMENT_TYPE_NUMBER_VALUES: any = {
  0: 'Большой Шлем',
  1: 'Про',
  2: 'Мастерс',
  11: 'Супермастерс', // new
  3: 'Челленджер',
  4: 'Фьючерс',
  5: 'Сателлит',
  6: 'Леджер',
  7: 'Тайбрейк',

  // previous used ids: 8, 9, 10, 16

  12: 'Парный Сателлит',
  13: 'Парный Суперсателлит', // new
  14: 'Парный Фьючерс',
  15: 'Парный Леджер', // new
  18: 'Парный Челенджер',
  20: 'Парный Мастерс',
  22: 'Парный Про',

  100: 'Итоговый Турнир', // new
  101: 'Парный ProAm', // new
};

export const SINGLES_TOURNAMENT_DRAW = [10, 3, 1, 12, 11, 4, 2, 13];
export const DOUBLES_TOURNAMENT_DRAW = [14, 15, 16, 17, 18];
export const TOURNAMENT_DRAW_WITH_QUAL = [11, 4, 2, 13];
export const TOURNAMENT_DRAW_TYPE_NUMBER_VALUES: any = {
  // olympic net (singles types)
  10: 'D8',
  3: 'D16',
  1: 'D32',
  12: 'D64', // new
  11: 'D8 + Q',
  4: 'D16 + Q',
  2: 'D32 + Q',
  13: 'D64 + Q', // new

  //  22, 5, 7, 6, 8, 9 // used indexes (deprecated)

  // groups net (doubles types)
  14: 'G6',
  15: 'G10',
  16: 'G12',
  17: 'G16',
  18: 'G6',
};

export const SURFACE_TYPE_NUMBER_VALUES: any = {
  0: 'Хард',
  1: 'Грунт',
  2: 'Трава',
};

export const TOURNAMENT_STATUS_NUMBER_VALUES = {
  1: 'Запись',
  2: 'Идет',
  3: 'Завершен',
};

export const DEFAULT_PAGINATION = { pageIndex: 0, pageSize: 25 };
export const DEFAULT_MODAL = { isOpen: false, type: '' };
