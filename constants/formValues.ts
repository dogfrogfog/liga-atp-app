import { z } from 'zod';

import {
  LEVEL_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  SURFACE_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES
} from './values';

export const PlayerSchema = z.object({
  first_name: z.number(),
  last_name: z.string(),
  date_of_birth: z.date(),
  city: z.string(),
  country: z.string(),
  email: z.string().email(),
  phone: z.number(),
  age: z.number().positive(),
  gameplay_style: z.string(),
  forehand: z.string(),
  beckhand: z.string(),
  insta_link: z.string(),
  is_coach: z.boolean(),
  in_tennis_from: z.date(),
  job_description: z.string(),
});
export type PlayerFormType = z.infer<typeof PlayerSchema>;

const PLAYER_FORM_VALUES = [
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

const TOURNAMENT_FORM_VALUES: any[] = [
  { name: 'name', required: true, type: 'text', placeholder: 'Название турнира' },
  { name: 'is_doubles', required: false, type: 'checkbox', placeholder: 'Парный турнир' },
  { name: 'tournament_type', required: true, type: 'select', placeholder: 'Тип турнира', options: TOURNAMENT_TYPE_NUMBER_VALUES },

  // players //

  { name: 'start_date', required: true, type: 'date', placeholder: 'Дата начала турнира' },
  { name: 'surface', required: true, type: 'select', placeholder: 'Тип покрытия', options: SURFACE_TYPE_NUMBER_VALUES },
  { name: 'status', required: true, type: 'select', placeholder: 'Статус', options: TOURNAMENT_STATUS_NUMBER_VALUES },
  { name: 'city', required: true, type: 'text', placeholder: 'Город' },

  // draw_type on the seconds page
];


const MATCHES_FORM_VALUES: any[] = [
  { name: 'name', required: false, type: 'text', placeholder: 'Название матча' },
]

export const FORM_VALUES = {
  players: PLAYER_FORM_VALUES,
  tournaments: TOURNAMENT_FORM_VALUES,
  matches: MATCHES_FORM_VALUES,
}
