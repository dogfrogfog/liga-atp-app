import { Dispatch, SetStateAction, ReactNode } from 'react'
import type { player as PlayerT, tournament as TournamentT } from '@prisma/client'
import { useForm } from 'react-hook-form'

import { FORM_VALUES } from '../../constants/values'
import Modal from '../../ui-kit/Modal'

import styles from './DataForm.module.scss'

// todo: add optional titles for each modal 
// update- 'Обновить данные игрока/турнира/матча',
// add- -Добавить нового игрока/турнира/матча',

interface IDataFormProps {
  setModalStatus: Dispatch<SetStateAction<{ isOpen: boolean, type: string }>>;
  editingRow?: PlayerT | TournamentT;
  onSubmit: any;
  type: 'players' | 'matches' | 'tournaments'
}

const getField = (props, register) => {
  switch (props.type) {
    case 'file':
    case 'checkbox': {
      return (
        <>
          <span>{props.placeholder}</span>
          <input
            type={props.type}
            {...register(props.name, { required: props.required })}
          />
        </>
      );
    };
    case 'select': {
      return (
        <select name={props.name} {...register(props.name, { required: props.required })}>
          {Object.entries(props.options).map(([key, value]) => (
            <option value={key}>{value as ReactNode}</option>
          ))}
        </select>
      )
    }
    default: {
      return (
        <input
          placeholder={props.placeholder}
          type={props.type}
          {...register(props.name, { required: props.required })}
        />
      )
    };
  }
}

// todo: edd validation + fiedls errors
const DataForm = ({ onSubmit, setModalStatus, editingRow, type }: IDataFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<PlayerT | TournamentT>({
    defaultValues: editingRow,
  });

  return (
    // <Modal title={T÷ITLES_BY_TYPE[modalStatus.type as 'add' | 'update']} setModalStatus={setModalStatus}>
    <Modal title="<form_title>" setModalStatus={setModalStatus}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {FORM_VALUES[type].map((props) => (
          <div key={props.name} className={styles.input}>
            {getField(props, register)}
          </div>
        ))}
        <input className={styles.submit} type="submit" />
      </form>
    </Modal>
  )
}

export default DataForm
