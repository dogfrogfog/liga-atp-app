export const PLAYER_FORM_VALUES: any[] = [
  // id: {
  // },
  // todo: camelize fields
  { name: 'first_name', required: false },
  { name: 'last_name', required: false },
  { name: 'date_of_birth', required: false },
  { name: 'city', required: false },
  { name: 'country', required: false },
  { name: 'age', required: false },
  { name: 'job_description', required: false },
  { name: 'years_in_tennis', required: false },
  { name: 'gameplay_style', required: false },
  { name: 'forehand', required: false },
  { name: 'beckhand', required: false },
  // todo: show only mnickname with @
  { name: 'instaLink', required: false },
  { name: 'isCoach', required: false },
  { name: 'medals', required: false },
  { name: 'email', required: false },
  { name: 'phone', required: false },
  { name: 'avatar', required: false },
  { name: 'level', required: false },
]

export const PLAYER_FORM_VALUES_KEYS = Object.keys(PLAYER_FORM_VALUES);
export const PLAYER_TABLE_VALUES_KEYS = ['id', ...Object.keys(PLAYER_FORM_VALUES)];
