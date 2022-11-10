export const LEVEL_NUMBER_VALUE = {
  4: 'leger',
  3: 'pro',
  2: 'masters',
  1: 'challenger',
  0: 'futures',
  '-1': 'Satellite', // todo: change index, reorder indexes
}

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
  { name: 'level', required: true, type: 'select', placeholder: 'Уровень', options: LEVEL_NUMBER_VALUE },
  { name: 'age', required: true, type: 'number', placeholder: 'Возраст' },
  { name: 'gameplay_style', required: true, type: 'text', placeholder: 'Стиль игры' },
  { name: 'forehand', required: true, type: 'text', placeholder: 'Форхэнд' },
  { name: 'beckhand', required: true, type: 'text', placeholder: 'Бэкэнд' },
  { name: 'insta_link', required: true, type: 'text', placeholder: 'Ссылка на инст' },
  { name: 'is_coach', required: false, type: 'checkbox', placeholder: 'Является тренером' },
  { name: 'in_tennis_from', required: true, type: 'date', placeholder: 'Начал играть' },
  { name: 'job_description', required: true, type: 'text', placeholder: 'Род деятельности' },
];

// {
//   "id": 3,
//   "name": "Finals Masters",
//   "address": "Смена",
//   "start_date": "2016-12-24",
//   "is_finished": 1,
//   "surface": 0,
//   "associated_tournament_id": null,
//   "draw_type": 6,
//   "players_order": "{\"players\":[623,532,533,492,437,596,453,648,657,546,548,549],\"seeds\":[623,532],\"wc\":[]}",
//   "draw": "{\"brackets\":[{\"id\":\"000\",\"team1Id\":623,\"team2Id\":-1},{\"id\":\"100\",\"team1Id\":533,\"team2Id\":-1},{\"id\":\"010\",\"team1Id\":492,\"team2Id\":-1},{\"id\":\"110\",\"team1Id\":532,\"team2Id\":-1},{\"id\":\"00\",\"matchId\":16,\"team1Id\":623,\"team2Id\":533},{\"id\":\"10\",\"matchId\":17,\"team1Id\":492,\"team2Id\":532},{\"id\":\"0\",\"matchId\":18,\"team1Id\":623,\"team2Id\":532}]}",
//   "city": "",
//   "tournament_type": 8
// }

export const TOURNAMENT_FORM_VALUES: any[] = [
  { name: 'name', required: false, type: 'text', placeholder: 'Название турнира' },
  { name: 'city', required: false, type: 'text', placeholder: 'Город проведения' },
  { name: 'address', required: false, type: 'text', placeholder: 'Место проведения' },
  { name: 'start_date', required: false, type: 'date', placeholder: 'Дата начала' },
  { name: 'is_finished', required: false, type: 'checkbox', placeholder: 'Закончен' },
  { name: 'surface', required: false, type: 'text', placeholder: 'Покрытие' },
  { name: 'draw_type', required: false, type: 'text', placeholder: '<Draw type>' },
  { name: 'players_order', required: false, type: 'text', placeholder: '<Порядок игроков>' },
  { name: 'draw', required: false, type: 'text', placeholder: '<Draw>' },
  { name: 'tournament_type', required: false, type: 'text', placeholder: '<Тип турнира>' },
]

export const MATCHES_FORM_VALUES: any[] = [
  { name: 'name', required: false, type: 'text', placeholder: 'Название матча' },
]

export const FORM_VALUES = {
  players: PLAYER_FORM_VALUES,
  tournaments: TOURNAMENT_FORM_VALUES,
  matches: MATCHES_FORM_VALUES,
}
