import type { Dispatch, SetStateAction } from 'react'
import type { core_player } from '@prisma/client'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { PLAYER_FORM_VALUES } from '../players/values';
import Modal from '../../../ui-kit/Modal'

import styles from './AddPlayerForm.module.scss'

interface IAddPlayerFormProps {
  setModalOpenStatus: Dispatch<SetStateAction<boolean>>;
}

const createPlayer = async (player: core_player) => {
  const response = await axios.post('/api/players', { body: player });

  if (response.status === 200) {
    return response.data;
  }

  throw new Error(response.statusText)
}

const AddPlayerForm = ({ setModalOpenStatus }: IAddPlayerFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<core_player>();

  console.log(errors)

  const onSubmit = (v) => {
    console.log(v)
  }

  return (
    <Modal title="Add new user" setModalOpenStatus={setModalOpenStatus}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {PLAYER_FORM_VALUES.map(({ name, required, type, placeholder, message }) => (
          <div className={styles.input}>
            {(type === 'checkbox' || type === 'file') ? (
              <>
                <span>{placeholder}</span>
                <input
                  key={name}
                  type={type}
                  {...register(name, { required })}
                />
              </>
            ) : (
              <input
                key={name}
                placeholder={placeholder}
                type={type}
                {...register(name, { required })}
              />
            )}
          </div>
        ))}
        <input className={styles.submit} type="submit" />
      </form>
    </Modal>
  )
}

export default AddPlayerForm


