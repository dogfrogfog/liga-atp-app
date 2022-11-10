export const LEVEL_NUMBER_VALUES: any = {
  4: 'leger',
  3: 'pro',
  2: 'masters',
  1: 'challenger',
  0: 'futures',
  '-1': 'Satellite', // todo: change index, reorder indexes
};

export const TOURNAMENT_TYPE_NUMBER_VALUES = {
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

export const SURFACE_TYPE_NUMBER_VALUES = {
  0: 'Хард',
  1: 'Грунт',
  2: 'Трава',
};

const ACTIVE_TYPE_VALUES = {
  1: 'Запись',
  2: 'Идет',
  3: 'Завершен',
};

export const DEFAULT_PAGINATION = { pageIndex: 0, pageSize: 25 };
export const DEFAULT_MODAL = { isOpen: false, type: '' };

export const PLAYER_FORM_VALUES = [
  { name: 'first_name', required: true, type: 'text', placeholder: 'Имя' },
  { name: 'last_name', required: true, type: 'text', placeholder: 'Фамилия' },
  { name: 'date_of_birth', required: true, type: 'date', placeholder: 'Дата рождения' },
  { name: 'city', required: true, type: 'text', placeholder: 'Город' },
  { name: 'country', required: true, type: 'text', placeholder: 'Страна' },
  { name: 'email', required: true, type: 'email', placeholder: 'E-mail' },
  { name: 'phone', required: true, type: 'phone', placeholder: 'Номер телефона' },
  // { name: 'avatar', required: true, type: 'file', placeholder: 'Ава' },
  { name: 'level', required: true, type: 'select', placeholder: 'Уровень', options: LEVEL_NUMBER_VALUES },
  { name: 'age', required: true, type: 'number', placeholder: 'Возраст' },
  { name: 'gameplay_style', required: true, type: 'text', placeholder: 'Стиль игры' },
  { name: 'forehand', required: true, type: 'text', placeholder: 'Форхэнд' },
  { name: 'beckhand', required: true, type: 'text', placeholder: 'Бэкэнд' },
  { name: 'insta_link', required: true, type: 'text', placeholder: 'Ссылка на инст' },
  { name: 'is_coach', required: false, type: 'checkbox', placeholder: 'Является тренером' },
  { name: 'in_tennis_from', required: true, type: 'date', placeholder: 'Начал играть' },
  { name: 'job_description', required: true, type: 'text', placeholder: 'Род деятельности' },
];

export const TOURNAMENT_FORM_VALUES: any[] = [
  { name: 'name', required: true, type: 'text', placeholder: 'Название турнира' },
  { name: 'is_doubles', required: false, type: 'checkbox', placeholder: 'Парный турнир' },
  { name: 'tournament_type', required: true, type: 'select', placeholder: 'Тип турнира', options: TOURNAMENT_TYPE_NUMBER_VALUES },
  
  // players //

  { name: 'start_date', required: true, type: 'date', placeholder: 'Дата начала турнира' },
  { name: 'surface', required: true, type: 'select', placeholder: 'Тип покрытия', options: SURFACE_TYPE_NUMBER_VALUES },
  { name: 'status', required: true, type: 'select', placeholder: 'Статус', options: ACTIVE_TYPE_VALUES },
  { name: 'city', required: true, type: 'text', placeholder: 'Город' },

  // draw_type on the seconds page
];


export const MATCHES_FORM_VALUES: any[] = [
  { name: 'name', required: false, type: 'text', placeholder: 'Название матча' },
]

export const FORM_VALUES = {
  players: PLAYER_FORM_VALUES,
  tournaments: TOURNAMENT_FORM_VALUES,
  matches: MATCHES_FORM_VALUES,
}
