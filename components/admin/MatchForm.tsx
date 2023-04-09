import { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { player as PlayerT, match as MatchT } from '@prisma/client';
import { format } from 'date-fns';

import InputWithError from 'ui-kit/InputWithError';
import formStyles from '../../styles/Form.module.scss';

export const getInputDateTimeFormatFromDate = (date: Date) =>
  format(date, 'yyyy-MM-dd') + 'T' + format(date, 'H:mm');

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
  const [dateTimeLocal, setDateTimeLocal] = useState<string | null>(
    match?.time ? getInputDateTimeFormatFromDate(new Date(match.time)) : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MatchT>({
    defaultValues: {
      player1_id: null,
      player2_id: null,
      player3_id: null,
      player4_id: null,
      ...match,
      time: match?.time || null,
    },
  });

  const handleMatchDateTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDateTimeLocal(e.target.value);
    setValue('time', new Date(e.target.value));
  };

  const sortedPlayers = registeredPlayers.sort((a, b) =>
    (a.last_name as string).localeCompare(b.last_name as string)
  );

  return (
    <div className={formStyles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWithError error={errors.player1_id}>
          Игрок 1
          <br />
          <select
            {...register('player1_id', {
              required: true,
              valueAsNumber: true,
            })}
          >
            <option>не выбран</option>
            {sortedPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        <InputWithError error={errors.player2_id}>
          Игрок 2
          <br />
          <select
            {...register('player2_id', {
              valueAsNumber: true,
            })}
          >
            <option>не выбран</option>
            {sortedPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        {isDoubles && (
          <>
            <InputWithError error={errors.player3_id}>
              Пара игрока 1 - игрок 3
              <br />
              <select {...register('player3_id', { valueAsNumber: true })}>
                <option>не выбран</option>
                {sortedPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {`${p.last_name} ${(p.first_name as string)[0]}`}
                  </option>
                ))}
              </select>
            </InputWithError>
            <InputWithError error={errors.player4_id}>
              Пара игрока 2 - игрок 4
              <br />
              <select {...register('player4_id', { valueAsNumber: true })}>
                <option>не выбран</option>
                {sortedPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {`${p.last_name} ${(p.first_name as string)[0]}`}
                  </option>
                ))}
              </select>
            </InputWithError>
          </>
        )}
        <InputWithError error={errors.winner_id}>
          Победитель - игрок 1 или игрок 2
          <br />
          <select {...register('winner_id')}>
            <option value="">не выбран</option>
            {sortedPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        <InputWithError error={errors.time}>
          Дата и время матча
          <br />
          <input
            value={dateTimeLocal || undefined}
            placeholder="Начало матча"
            type="datetime-local"
            onChange={handleMatchDateTimeChange}
          />
        </InputWithError>
        <br />
        <p>если матч завершился без счета - указывать {'"w/o"'}</p>
        <InputWithError error={errors.score}>
          Счет
          <br />
          <input
            {...register('score', {
              pattern: {
                value: /^((\d{1,2}-\d{1,2} )|w\/o){1,5}/,
                message: 'correct format: 6-2 2-6 10-2',
              },
            })}
          />
        </InputWithError>
        <InputWithError error={errors.youtube_link}>
          Ссылка на ютюб
          <br />
          <input
            className={formStyles.youtubeLink}
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
