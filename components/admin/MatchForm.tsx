import { useForm } from 'react-hook-form';
import { player as PlayerT, match as MatchT } from '@prisma/client';
import { format } from 'date-fns';

import InputWithError from 'ui-kit/InputWithError';
import formStyles from '../../styles/Form.module.scss';

const MatchForm = ({
  isDoubles,
  match,
  onSubmit,
  registeredPlayers,
}: {
  registeredPlayers: PlayerT[];
  match?: MatchT;
  onSubmit: (v: MatchT) => Promise<void>;
  isDoubles: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      player1_id: null,
      player2_id: null,
      player3_id: null,
      player4_id: null,
      ...match,
      start_date: match?.start_date
        ? format(new Date(match?.start_date), 'yyyy-MM-dd')
        : null,
    },
  });

  return (
    <div className={formStyles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWithError errorMessage={errors.player1_id?.message}>
          <br />
          Игрок 1:
          <select
            {...register('player1_id', {
              required: true,
              valueAsNumber: true,
            })}
          >
            <option>не выбран</option>
            {registeredPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        <InputWithError errorMessage={errors.player2_id?.message}>
          <br />
          Игрок 2:
          <select
            {...register('player2_id', {
              valueAsNumber: true,
            })}
          >
            <option>не выбран</option>
            {registeredPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        {isDoubles && (
          <>
            <InputWithError errorMessage={errors.player3_id?.message}>
              <br />
              Пара игрока 1 - игрок 3:
              <select {...register('player3_id', { valueAsNumber: true })}>
                <option>не выбран</option>
                {registeredPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {`${p.last_name} ${(p.first_name as string)[0]}`}
                  </option>
                ))}
              </select>
            </InputWithError>
            <InputWithError errorMessage={errors.player4_id?.message}>
              <br />
              Пара игрока 2 - игрок 4:
              <select {...register('player4_id', { valueAsNumber: true })}>
                <option>не выбран</option>
                {registeredPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {`${p.last_name} ${(p.first_name as string)[0]}`}
                  </option>
                ))}
              </select>
            </InputWithError>
          </>
        )}
        <InputWithError errorMessage={errors.winner_id?.message}>
          <br />
          Победитель - игрок 1 или игрок 2:
          <select {...register('winner_id')}>
            <option value="">не выбран</option>
            {registeredPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        <InputWithError errorMessage={errors.start_date?.message}>
          <input
            placeholder="Начало матча"
            type="date"
            {...register('start_date', { required: false, valueAsDate: true })}
          />
        </InputWithError>
        <br />
        <p>если матч завершился без счета - указывать {'"w/o"'}</p>
        <InputWithError errorMessage={errors.score?.message}>
          <input
            placeholder="Счет"
            {...register('score', {
              pattern: {
                value: /^((\d{1,2}-\d{1,2} )|w\/o){1,5}/,
                message: 'correct format: 6-2 2-6 10-2',
              },
            })}
          />
        </InputWithError>
        <br />
        <InputWithError errorMessage={errors.youtube_link?.message}>
          <input
            className={formStyles.youtubeLink}
            placeholder="Ссылка на ютюб"
            {...register('youtube_link', {
              pattern: {
                value: /^(https:\/\/)/,
                message: 'should starts with https://',
              },
            })}
          />
        </InputWithError>
        <div className={formStyles.formActions}>
          <input className={formStyles.submitButton} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default MatchForm;
