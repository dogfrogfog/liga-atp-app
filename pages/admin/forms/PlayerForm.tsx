import type { UseFormReturn } from 'react-hook-form'
import type { core_player } from '@prisma/client'
import axios from 'axios'

import { PLAYER_FORM_VALUES } from '../players/values';

// todo: put form to modal window (should be saparate UI-kit component)
interface IPlayerFormProps {
  onSubmit: any;
  useFormProps: UseFormReturn<core_player>;
}

const PlayerForm = ({ onSubmit, useFormProps }: IPlayerFormProps) => {
  const { register, handleSubmit, watch, formState: { errors } } = useFormProps;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {PLAYER_FORM_VALUES.map(({ name, required }) => (
        <input {...register(name, { required })} />
      ))}
      <input type="submit" />
    </form>
  )
}

export default PlayerForm

const createPlayer = async (player: core_player) => {
  const response = await axios.post('/api/players', { body: player });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText)
}