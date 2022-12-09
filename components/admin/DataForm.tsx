import type { ReactNode } from 'react';
import type {
  player as PlayerT,
  tournament as TournamentT,
  match as MatchT,
} from '@prisma/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Modal from 'ui-kit/Modal';
import { FORM_RESOLVERS, FORM_VALUES } from 'constants/formValues';

import styles from './DataForm.module.scss';

interface IDataFormProps {
  type: 'players' | 'matches' | 'tournaments';
  formTitle: string;
  onSubmit: any;
  onClose: any;
  editingRow?: PlayerT | TournamentT | MatchT | null;
  registeredPlayers?: PlayerT[];
}

interface IInputWithError {
  errorMessage: string;
  children: ReactNode;
}

const InputWithError = ({ errorMessage, children }: IInputWithError) => {
  return (
    <>
      {children}
      <p className={styles.errorMessage}>{errorMessage}</p>
    </>
  );
};

const getField = (props: any, register: any, errors: any) => {
  switch (props.type) {
    case 'checkbox': {
      return (
        <InputWithError errorMessage={errors[props.name]?.message}>
          <input
            type={props.type}
            {...register(props.name, { required: props.required })}
          />
        </InputWithError>
      );
    }
    case 'select': {
      return (
        <InputWithError errorMessage={errors[props.name]?.message}>
          <select
            name={props.name}
            {...register(props.name, { required: props.required })}
          >
            {Object.entries(props.options).map(([key, value]) => (
              <option key={key} value={key}>
                {value as ReactNode}
              </option>
            ))}
          </select>
        </InputWithError>
      );
    }
    default: {
      return (
        <InputWithError errorMessage={errors[props.name]?.message}>
          <input
            type={props.type}
            {...register(props.name, { required: props.required })}
            autoComplete="off"
          />
        </InputWithError>
      );
    }
  }
};

// todo: add checkbox for winner
// will be checked if player/pair is a winner
const REGISTERED_PLAYERS_FIELD_NAMES = [
  'player1_id',
  'player2_id',
  'player3_id',
  'player4_id',
  'winner_id',
];

// todo: add validation + errors
const DataForm = ({
  onSubmit,
  onClose,
  editingRow,
  type,
  formTitle,
  registeredPlayers = [],
}: IDataFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(FORM_RESOLVERS[type]),
    defaultValues: editingRow,
  });

  return (
    <Modal title={formTitle} handleClose={onClose}>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        {FORM_VALUES[type].map((props) => {
          // to have ability to explicitly pass options to select fields
          if (
            type === 'matches' &&
            REGISTERED_PLAYERS_FIELD_NAMES.indexOf(props.name) !== -1
          ) {
            return (
              <div key={props.name} className={styles.input}>
                <span>{props.placeholder}</span>
                <InputWithError
                  key={'trick' + props.name}
                  errorMessage={errors[props.name]?.message as any}
                >
                  <select
                    // @ts-ignore
                    name={props.name}
                    {...register(props.name, {
                      required: props.required,
                      valueAsNumber: true,
                    })}
                  >
                    <option value="">not selected</option>
                    {registeredPlayers.map(({ id, first_name, last_name }) => (
                      <option key={id} value={id}>
                        {last_name + ' ' + first_name}
                      </option>
                    ))}
                  </select>
                </InputWithError>
              </div>
            );
          }

          return (
            <div key={props.name} className={styles.input}>
              <span>{props.placeholder}</span>
              {getField(props, register, errors)}
            </div>
          );
        })}
        <div className={styles.container}>
          <input className={styles.reset} type="reset" />
          <input className={styles.submit} type="submit" />
        </div>
      </form>
    </Modal>
  );
};

export default DataForm;
