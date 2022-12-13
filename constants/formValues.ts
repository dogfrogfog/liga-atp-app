import { z } from 'zod';

import {
  LEVEL_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  SURFACE_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
} from './values';

const PlayerSchema = z.object({
  avatar: z.string().min(2),
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  date_of_birth: z.string().min(2),
  city: z.string().min(2),
  country: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(2),
  age: z.number().min(2),
  gameplay_style: z.string().min(2),
  forehand: z.string().min(2),
  beckhand: z.string().min(2),
  insta_link: z.string().min(2),
  is_coach: z.boolean(),
  in_tennis_from: z.string().min(2),
  job_description: z.string().min(2),
});

const TournamentSchema = z.object({
  name: z.string().min(2),
  is_doubles: z.boolean(),
  tournament_type: z.string(),
  start_date: z.string().min(2),
  surface: z.string(),
  status: z.string(),
  city: z.string().min(2),
});

// make this validation correct work with form
// need refactor this part so as add some clean(prod version) code here
const MatchSchema = z.object({
  player1_id: z.any(),
  player2_id: z.any().nullable(),
  player3_id: z.any().nullable(),
  player4_id: z.any().nullable(),
  winner_id: z.any().nullable(),
  score: z.string().nullable(),
  start_date: z.union([z.string(), z.date()]).nullable(),
});

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
  'age',
  'gameplay_style',
  'forehand',
  'beckhand',
  'insta_link',
  'job_description',
  'in_tennis_from',
  'is_coach',
];

const TOURNAMENT_FORM_VALUES: any[] = [
  {
    name: 'name',
    required: true,
    type: 'text',
    placeholder: 'Название турнира',
  },
  { name: 'city', required: true, type: 'text', placeholder: 'Город' },
  {
    name: 'tournament_type',
    required: true,
    type: 'select',
    placeholder: 'Тип турнира',
    options: TOURNAMENT_TYPE_NUMBER_VALUES,
  },

  // players //

  {
    name: 'start_date',
    required: true,
    type: 'date',
    placeholder: 'Дата начала турнира',
  },
  {
    name: 'surface',
    required: true,
    type: 'select',
    placeholder: 'Тип покрытия',
    options: SURFACE_TYPE_NUMBER_VALUES,
  },
  {
    name: 'status',
    required: true,
    type: 'select',
    placeholder: 'Статус',
    options: TOURNAMENT_STATUS_NUMBER_VALUES,
  },
  {
    name: 'is_doubles',
    required: false,
    type: 'checkbox',
    placeholder: 'Парный турнир',
  },

  // draw_type on the seconds page
];

const MATCHES_FORM_VALUES: any[] = [
  {
    name: 'player1_id',
    required: true,
    type: 'select',
    placeholder: 'Игрок 1',
  },
  {
    name: 'player3_id',
    required: false,
    type: 'select',
    placeholder: 'Игрок 3 (пара игрока 1)',
  },
  {
    name: 'start_date',
    required: false,
    type: 'date',
    placeholder: 'Дата матча',
  },
  {
    name: 'player2_id',
    required: false,
    type: 'select',
    placeholder: 'Игрок 2',
  },
  {
    name: 'player4_id',
    required: false,
    type: 'select',
    placeholder: 'Игрок 4 (пара игрока 2)',
  },
  { name: 'score', required: false, type: 'text', placeholder: 'Счет' }, // should be regexped
  {
    name: 'winner_id',
    required: false,
    type: 'select',
    placeholder: 'Победитель (главный игрок 1 пары или главный игрок 2 пары)',
  },
];

export const FORM_VALUES = {
  tournaments: TOURNAMENT_FORM_VALUES,
  matches: MATCHES_FORM_VALUES,
};

// todo: put resolvers in separate file
export const FORM_RESOLVERS: any = {
  players: PlayerSchema,
  tournaments: TournamentSchema,
  matches: MatchSchema,
};
