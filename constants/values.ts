type NumberValuesT = {
  [k: number]: string;
};

export const LEVEL_NUMBER_VALUES: NumberValuesT = {
  4: 'leger',
  3: 'pro',
  2: 'masters',
  1: 'challenger',
  0: 'futures',
  [-1]: 'Satellite',
};

// previously used indexes: 8, 9, 10, 16
export const TOURNAMENT_TYPE_NUMBER_VALUES: NumberValuesT = {
  0: 'Большой Шлем',
  1: 'Про',
  2: 'Мастерс',
  11: 'Супермастерс',
  3: 'Челленджер',
  4: 'Фьючерс',
  5: 'Сателлит',
  6: 'Леджер',
  7: 'Тайбрейк',
  12: 'Парный Сателлит',
  13: 'Парный Суперсателлит',
  14: 'Парный Фьючерс',
  15: 'Парный Леджер',
  18: 'Парный Челенджер',
  20: 'Парный Мастерс',
  22: 'Парный Про',
  100: 'Итоговый Турнир',
  101: 'Парный ProAm',
};

// previously used indexes: 22, 5, 7, 6, 8, 9
export const TOURNAMENT_DRAW_TYPE_NUMBER_VALUES: NumberValuesT = {
  // olympic net
  10: 'D8',
  3: 'D16',
  1: 'D32',
  12: 'D64',
  11: 'D8 + Q',
  4: 'D16 + Q',
  2: 'D32 + Q',
  13: 'D64 + Q',
  // groups net
  14: 'G6',
  15: 'G8',
  16: 'G10',
  17: 'G12',
  18: 'G16',
};

export const SURFACE_TYPE_NUMBER_VALUES: NumberValuesT = {
  0: 'Хард',
  1: 'Грунт',
  2: 'Трава',
};

export const TOURNAMENT_STATUS_NUMBER_VALUES: NumberValuesT = {
  1: 'Запись',
  2: 'Идет',
  3: 'Завершен',
};

export const DEFAULT_PAGINATION = { pageIndex: 0, pageSize: 25 };
export const DEFAULT_MODAL = { isOpen: false, type: '' };

export const PLAYER_COLUMNS = [
  'avatar',
  'first_name',
  'last_name',
  'date_of_birth',
  'city',
  'country',
  'email',
  'phone',
  'level',
  'gameplay_style',
  'forehand',
  'beckhand',
  'insta_link',
  'job_description',
  'in_tennis_from',
  'is_coach',
  'technique',
  'tactics',
  'power',
  'shakes',
  'serve',
  'behaviour',
];

export const TOURNAMENT_COLUMNS = [
  'name',
  'address',
  'tournament_type',
  'draw',
  'start_date',
  'surface',
  'status',
  'city',
  'is_doubles',
  'draw_type',
  'players_order',
];
