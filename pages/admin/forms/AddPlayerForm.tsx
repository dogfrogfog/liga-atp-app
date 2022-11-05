import { Dispatch, SetStateAction, Fragment } from 'react'
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
  const response = await axios.post('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, message: 'player was successfully screated' }
  } else {
    // throw new Error(response.statusText)
    return { isOk: false, message: response.statusText }
  }
}

const AddPlayerForm = ({ setModalOpenStatus }: IAddPlayerFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<core_player>();
  // todo: add fields validation and show message/paint red if there is an error
  // const { formState: { errors } } = useForm<core_player>();

  const onSubmit = async (v) => {
    const { isOk, message } = await createPlayer({ ...v, medals: 1, level: 1, is_coach: 0, avatar: 'linkkk' })

    console.log(isOk, message)
  }

  return (
    <Modal title="Add new user" setModalOpenStatus={setModalOpenStatus}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {PLAYER_FORM_VALUES.map(({ name, required, type, placeholder, message }) => (
          <div className={styles.input}>
            {(type === 'checkbox' || type === 'file') ? (
              <Fragment key={name}>
                <span>{placeholder}</span>
                <input
                  type={type}
                  {...register(name, { required })}
                />
              </Fragment>
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


