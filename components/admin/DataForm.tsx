import type { ReactNode } from 'react'
import type { player as PlayerT, tournament as TournamentT } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod";

import Modal from 'ui-kit/Modal'
import { FORM_RESOLVERS, FORM_VALUES } from 'constants/formValues'

import styles from './DataForm.module.scss'

interface IDataFormProps {
  type: 'players' | 'matches' | 'tournaments';
  formTitle: string;
  onSubmit: any;
  onClose: any;
  editingRow?: PlayerT | TournamentT;
}

type IErrorMessageProps = {
  errorMessage: string
}

const ErrorMessage = ({errorMessage}: IErrorMessageProps) => {
  return (
    <p className={styles.errorMessage}>
      {errorMessage}
    </p>
  );
};

const getField = (props: any, register: any, errors: any) => {
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
          {errors[props.name] && (<ErrorMessage errorMessage={errors[props.name].message}/>)}
        </>
      );
    };
    case 'select': {
      return (
        <>
          <select name={props.name} {...register(props.name, { required: props.required })}>
            {Object.entries(props.options).map(([key, value]) => (
              <option key={key} value={key}>{value as ReactNode}</option>
            ))}
          </select>
          {errors[props.name] && (<ErrorMessage errorMessage={errors[props.name].message}/>)}
        </>
      )
    }
    default: {
      return (
        <>
          <input
            placeholder={props.placeholder}
            type={props.type}
            {...register(props.name, { required: props.required })}
          />
          {errors[props.name] && (<ErrorMessage errorMessage={errors[props.name].message}/>)}
        </>
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
  const { register, handleSubmit, watch, formState: { errors } } = useForm<any>({
    resolver: zodResolver(FORM_RESOLVERS[type]),
    defaultValues: editingRow,
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
    </Modal>
  );
}

export default DataForm