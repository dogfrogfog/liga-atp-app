import { Dispatch, SetStateAction } from 'react'
import type { player } from '@prisma/client'
import { useForm } from 'react-hook-form'

import { PLAYER_FORM_VALUES } from '../../constants/values'
import Modal from '../../ui-kit/Modal'

import styles from './DataForm.module.scss'

// todo: add optional titles for each modal 
// update- 'Обновить данные игрока/турнира/матча',
// add- -Добавить нового игрока/турнира/матча',

interface IDataFormProps {
  setModalStatus: Dispatch<SetStateAction<{ isOpen: boolean, type: string }>>;
  editingRow?: player;
  onSubmit: any;
  type: 'players' | 'matches' | 'tournaments'
}

// todo: edd validation + fiedls errors
const DataForm = ({ onSubmit, setModalStatus, editingRow, type }: IDataFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<player>({
    defaultValues: editingRow,
  });

  return (
    // <Modal title={T÷ITLES_BY_TYPE[modalStatus.type as 'add' | 'update']} setModalStatus={setModalStatus}>
    <Modal title="<form_title>" setModalStatus={setModalStatus}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {PLAYER_FORM_VALUES.map(({ name, required, type, placeholder, message }) => (
          <div key={name} className={styles.input}>
            {(type === 'checkbox' || type === 'file') ? (
              <>
                <span>{placeholder}</span>
                <input
                  type={type}
                  {...register(name, { required })}
                />
              </>
            ) : (
              <input
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

export default DataForm
