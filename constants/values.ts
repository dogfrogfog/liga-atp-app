type NumberValuesT = {
  [k: number]: string;
};

export const DEFAULT_PROFILE_IMAGE: string = "/roger.webp";

export const LEVEL_NUMBER_VALUES: NumberValuesT = {
  5: 'S-Мастерс',
  4: 'Леджер',
  3: 'Про',
  2: 'Мастерс',
  1: 'Челленджер',
  0: 'Фьючерс',
  [-1]: 'Сателлит',
};

export const LEVEL_NUMBER_LIVE: NumberValuesT = {
  1: 'Сателлит',
  2: 'Фьючерс',
  3: 'Леджер',
  4: 'Челленджер',
  5: 'Мастерс',
  6: 'S-Мастерс',
  7: 'Про',
};

export const LEVELS_TABS: string[] = [
  'Все', 
  'Сателлит', 
  'Фьючерс', 
  'Леджер', 
  'Челленджер', 
  'Мастерс', 
  'S-Мастерс', 
  'Про'
];

// previously used indexes: 8, 9, 10, 16
export const TOURNAMENT_TYPE_NUMBER_VALUES: NumberValuesT = {
  0: 'Большой Шлем',
  1: 'Про',
  2: 'Мастерс',
  11: 'S-мастерс',
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
  23: 'Парный Большой Шлем',
  100: 'Итоговый Турнир',
  101: 'Парный ProAm',
};

export const DOUBLES_TOURNAMENT_TYPES_NUMBER: number[] = [
  // deprecated
  16,

  12, 13, 14, 15, 18, 20, 22, 23, 101,
];

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

export const GROUPS_DRAW_TYPES = [14, 15, 16, 17, 18];
export const singleStagesNames = ['R64', 'R32', 'R16', 'QF', 'SF', 'F'];
export const groupStagesNames = ['QF', 'SF', 'F'];

export const SURFACE_TYPE_NUMBER_VALUES: NumberValuesT = {
  0: 'Хард',
  1: 'Грунт',
  2: 'Трава',
  3: 'Хард', // indoor hard
};

export const TOURNAMENT_STATUS_NUMBER_VALUES: NumberValuesT = {
  1: 'Запись',
  2: 'Идет',
  3: 'Завершен',
};

export const MATCHES_TABS_MAIN: string[] = ['Матчи сегодня', 'Матчи завтра'];

export const DEFAULT_MODAL = { isOpen: false, type: '' };

export const PLAYER_COLUMNS = [
  'first_name',
  'last_name',
  'premium',
  'elo_points',
  'date_of_birth',
  'level',
  'height',
  'city',
  'country',
  'avatar',
  'email',
  'phone',
  'gameplay_style',
  'forehand',
  'backhand',
  'insta_link',
  'job_description',
  'in_tennis_from',
  'technique',
  'psychology',
  'power',
  'net_game',
  'serve',
  'behavior',
] as const;

export const TOURNAMENT_COLUMNS = [
  'id',
  'name',
  'city',
  'address',
  'start_date',
  'tournament_type',
  'tournament_level',
  'draw_type',
  'surface',
  'status',
] as const;

export const DIGEST_PAGE_SIZE = 30;
export const PLAYED_TOURNAMENT_PAGE_SIZE = 50;
export const PLAYERS_PAGE_SIZE = 70;

export const INITIAL_ELO_POINTS_BY_LEVEL: { [k: number]: number } = {
  5: 2100,
  4: 1500,
  3: 1900,
  2: 1700,
  1: 1300,
  0: 1100,
  [-1]: 900,
};
