import { z } from 'zod';

import {
  LEVEL_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  SURFACE_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
} from './values';

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

export const TOURNAMENT_COLUMNS = [
  'name',
  'address',
  'tournament_type',
  'draw',
  'start_date',
  'surface',
  'status',
  'city',
  'is_doubles',
  'draw_type',
  'players_order',
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
  matches: MATCHES_FORM_VALUES,
};

// todo: put resolvers in separate file
export const FORM_RESOLVERS: any = {
  matches: MatchSchema,
};
