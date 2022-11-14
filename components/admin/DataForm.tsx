import type { ReactNode } from 'react'
import type { player as PlayerT, tournament as TournamentT } from '@prisma/client'
import { useForm } from 'react-hook-form'

import Modal from 'ui-kit/Modal'
import { FORM_VALUES } from 'constants/values'

import styles from './DataForm.module.scss'
import {AddPlayerFormType, AddPlayerSchema} from "../../zod/admin/addPlayer";
import {zodResolver} from "@hookform/resolvers/zod";

interface IDataFormProps {
  type: 'players' | 'matches' | 'tournaments';
  formTitle: string;
  onSubmit: any;
  onClose: any;
  editingRow?: PlayerT | TournamentT;
}

const getField = (props: any, register: any, errors:any) => {
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
          {errors[props.name] && (<p>Error</p>)}
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

// todo: add validation + errors
const DataForm = ({
  onSubmit,
  onClose,
  editingRow,
  type,
  formTitle,
}: IDataFormProps) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<AddPlayerFormType>({
    resolver: zodResolver(AddPlayerSchema)
  });

  return (
    <Modal title={formTitle} handleClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {FORM_VALUES[type].map((props) => (
          <div key={props.name} className={styles.input}>
            {getField(props, register, errors)}
          </div>
        ))}
        <input className={styles.submit} type="submit" />
      </form>
      <pre>{JSON.stringify(watch(), null, 2)}</pre>
    </Modal>
  );
}

export default DataForm