export const PLAYER_FORM_VALUES: any[] = [
  // id: {
  // },
  // todo: camelize fields
  { name: 'first_name', required: true, type: 'text', placeholder: 'Имя' },
  { name: 'last_name', required: true, type: 'text', placeholder: 'Фамилия' },
  { name: 'date_of_birth', required: true, type: 'date', placeholder: 'Дата рождения' },
  { name: 'city', required: true, type: 'text', placeholder: 'Город' },
  { name: 'country', required: true, type: 'text', placeholder: 'Страна' },
  { name: 'age', required: true, type: 'number', placeholder: 'Возраст' },
  { name: 'job_description', required: true, type: 'text', placeholder: 'Род деятельности' },
  { name: 'years_in_tennis', required: true, type: 'text', placeholder: 'Лет в теннисе' },
  { name: 'gameplay_style', required: true, type: 'text', placeholder: 'Стиль игры' },
  { name: 'forehand', required: true, type: 'text', placeholder: 'Форхэнд' },
  { name: 'beckhand', required: true, type: 'text', placeholder: 'Бэкэнд' },
  // todo: show only mnickname with @
  { name: 'instaLink', required: true, type: 'text', placeholder: 'Ссылка на инст' },
  { name: 'medals', required: false, placeholder: '' },
  { name: 'email', required: true, type: 'email', placeholder: 'E-mail' },
  { name: 'phone', required: true, type: 'phone', placeholder: 'Номер телефона' },
  { name: 'level', required: true, type: 'text', placeholder: 'Уровень' },
  { name: 'avatar', required: true, type: 'file', placeholder: 'Ава' },
  { name: 'isCoach', required: true, type: 'checkbox', placeholder: 'Является тренером' },
]

export const PLAYER_FORM_VALUES_KEYS = Object.keys(PLAYER_FORM_VALUES);
export const PLAYER_TABLE_VALUES_KEYS = ['id', ...Object.keys(PLAYER_FORM_VALUES)];
