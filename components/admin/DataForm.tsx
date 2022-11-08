import { Dispatch, SetStateAction } from 'react'
import type { player } from '@prisma/client'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { PLAYER_FORM_VALUES } from '../../constants/values'
import Modal from '../../ui-kit/Modal'

import styles from './DataForm.module.scss'

const TITLES_BY_TYPE: Record<'add' | 'update', string> = {
  update: 'Обновить данные игрока',
  add: 'Добавить нового игрока',
}

interface IPlayerFormProps {
  modalStatus: { isOpen: boolean, type: string };
  setModalStatus: Dispatch<SetStateAction<{ isOpen: boolean, type: string }>>;
  editingRow?: player;
  setData: any;
  pagination: any;
}

const createPlayer = async (player: player) => {
  const response = await axios.post('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, message: 'player was successfully screated' }
  } else {
    return { isOk: false, message: response.statusText }
  }
}

const updatePlayer = async (player: player) => {
  const response = await axios.put('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, message: 'player was successfully updated' }
  } else {
    return { isOk: false, message: response.statusText }
  }
}



// todo: edd validation + fiedls errors
const DataForm = ({ pagination, setData, modalStatus, setModalStatus, editingRow }: IPlayerFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<player>({
    defaultValues: editingRow,
  });

  const fetchWrapper = async () => {
    const url = `/api/players?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`
    const response = await axios.get<player[]>(url)

    if (response.status === 200) {
      setData(response.data)
    }
  }

  // todo: add notifications
  const onSubmit = async (v: any) => {
    if (modalStatus.type === 'add') {
      //todo: refactor and provide real data when postgres cc @corpsolovei types are ready
      const { isOk, message } = await createPlayer({ ...v, medals: 1, level: 1, is_coach: 0, avatar: 'linkkk' })

      if (isOk) {
        setModalStatus({ type: '', isOpen: false });

        fetchWrapper()
      } else {
        console.warn(message)
      }
    }

    if (modalStatus.type === 'update') {
      const { isOk, message } = await updatePlayer({ ...v, medals: 1, level: 1, is_coach: 0, avatar: 'linkkk' })
      if (isOk) {
        setModalStatus({ type: '', isOpen: false })

        fetchWrapper()
      } else {
        console.warn(message)
      }
    }
  }

  return (
    <Modal title={TITLES_BY_TYPE[modalStatus.type as 'add' | 'update']} setModalStatus={setModalStatus}>
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
