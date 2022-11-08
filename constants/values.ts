export const LEVEL_NUMBER_VALUE = {
  4: 'leger',
  3: 'pro',
  2: 'masters',
  1: 'challenger',
  0: 'futures',
  '-1': 'Satellite', // todo: change index, reorder indexes
}

export const PLAYER_FORM_VALUES: any[] = [
  // todo: camelize fields
  { name: 'first_name', required: false, type: 'text', placeholder: 'Имя' },
  { name: 'last_name', required: false, type: 'text', placeholder: 'Фамилия' },
  { name: 'date_of_birth', required: false, type: 'date', placeholder: 'Дата рождения' },
  { name: 'city', required: false, type: 'text', placeholder: 'Город' },
  { name: 'country', required: false, type: 'text', placeholder: 'Страна' },
  // { name: 'age', required: false, type: 'number', placeholder: 'Возраст' },
  // { name: 'job_description', required: false, type: 'text', placeholder: 'Род деятельности' },
  // { name: 'years_in_tennis', required: false, type: 'text', placeholder: 'Лет в теннисе' },
  // { name: 'gameplay_style', required: false, type: 'text', placeholder: 'Стиль игры' },
  // { name: 'forehand', required: false, type: 'text', placeholder: 'Форхэнд' },
  // { name: 'beckhand', required: false, type: 'text', placeholder: 'Бэкэнд' },
  // todo: show only mnickname with @
  // { name: 'insta_link', required: false, type: 'text', placeholder: 'Ссылка на инст' },
  // { name: 'medals', required: false, placeholder: '' },
  // { name: 'email', required: false, type: 'email', placeholder: 'E-mail' },
  // { name: 'phone', required: false, type: 'phone', placeholder: 'Номер телефона' },
  // { name: 'level', required: false, type: 'text', placeholder: 'Уровень' },
  // { name: 'avatar', required: false, type: 'file', placeholder: 'Ава' },
  // { name: 'is_coach', required: false, type: 'checkbox', placeholder: 'Является тренером' },
]

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

// export const PLAYER_FORM_VALUES_KEYS = Object.keys(PLAYER_FORM_VALUES)
// export const PLAYER_TABLE_VALUES_KEYS = ['id', ...Object.keys(PLAYER_FORM_VALUES)]
