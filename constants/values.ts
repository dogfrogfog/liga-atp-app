export const LevelNumberMap = {
  '4': 'leger',
  '3': 'pro',
  '2': 'masters',
  '1': 'challenger',
  '0': 'futures',
  '-1': 'Satellite',
}

export const PLAYER_FORM_VALUES: any[] = [
  // id: {
  // },
  // todo: camelize fields
  { name: 'first_name', required: false, type: 'text', placeholder: 'Имя' },
  { name: 'last_name', required: false, type: 'text', placeholder: 'Фамилия' },
  { name: 'date_of_birth', required: false, type: 'date', placeholder: 'Дата рождения' },
  { name: 'city', required: false, type: 'text', placeholder: 'Город' },
  { name: 'country', required: false, type: 'text', placeholder: 'Страна' },
  { name: 'age', required: false, type: 'number', placeholder: 'Возраст' },
  { name: 'job_description', required: false, type: 'text', placeholder: 'Род деятельности' },
  { name: 'years_in_tennis', required: false, type: 'text', placeholder: 'Лет в теннисе' },
  { name: 'gameplay_style', required: false, type: 'text', placeholder: 'Стиль игры' },
  { name: 'forehand', required: false, type: 'text', placeholder: 'Форхэнд' },
  { name: 'beckhand', required: false, type: 'text', placeholder: 'Бэкэнд' },
  // todo: show only mnickname with @
  { name: 'insta_link', required: false, type: 'text', placeholder: 'Ссылка на инст' },
  { name: 'medals', required: false, placeholder: '' },
  { name: 'email', required: false, type: 'email', placeholder: 'E-mail' },
  { name: 'phone', required: false, type: 'phone', placeholder: 'Номер телефона' },
  { name: 'level', required: false, type: 'text', placeholder: 'Уровень' },
  { name: 'avatar', required: false, type: 'file', placeholder: 'Ава' },
  { name: 'is_coach', required: false, type: 'checkbox', placeholder: 'Является тренером' },
]

export const PLAYER_FORM_VALUES_KEYS = Object.keys(PLAYER_FORM_VALUES)
export const PLAYER_TABLE_VALUES_KEYS = ['id', ...Object.keys(PLAYER_FORM_VALUES)]
