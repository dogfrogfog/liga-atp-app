import { z } from 'zod';

import {
  LEVEL_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  SURFACE_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES
} from './values';

export const PlayerSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  date_of_birth: z.string(),
  city: z.string().min(2),
  country: z.string().min(2),
  email: z.string().email(),
  phone: z.string().refine((val) => !Number.isNaN(parseInt(val, 10))),
  age: z.string().refine((val) => !Number.isNaN(parseInt(val, 10))),
  gameplay_style: z.string().min(2),
  forehand: z.string().min(2),
  beckhand: z.string().min(2),
  insta_link: z.string().min(2),
  is_coach: z.boolean(),
  in_tennis_from: z.string(),
  job_description: z.string().min(2),
});
export type PlayerFormType = z.infer<typeof PlayerSchema>;

export const TournamentSchema = z.object({
  name: z.string().min(2),
  is_doubles: z.boolean(),
  tournament_type: z.string(),
  start_date: z.string().min(2),
  surface: z.string(),
  status: z.string(),
  city: z.string().min(2),
});
export type TournamentFormType = z.infer<typeof TournamentSchema>;

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

export const FORM_RESOLVERS: any = {
  players: PlayerSchema,
  tournaments: TournamentSchema
}
