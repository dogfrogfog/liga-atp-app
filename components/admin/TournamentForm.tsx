import cl from 'classnames';
import type { ChangeEvent } from 'react';

import { getInitialBrackets } from 'utils/bracket';
import {
  TOURNAMENT_DRAW_TYPE_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
  SURFACE_TYPE_NUMBER_VALUES,
} from 'constants/values';
import styles from './TournamentForm.module.scss';

const TournamentForm = ({ register, setValue }: any) => {
  const handleDrawTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue('draw_type', parseInt(e.target.value));
    setValue(
      'draw',
      JSON.stringify({
        brackets: getInitialBrackets(parseInt(e.target.value, 10)),
      })
    );
  };

  return (
    <form>
      <div className={cl(styles.field, styles.inputField)}>
        <span>Название турнира</span>
        <input
          {...register('name', {
            required: true,
          })}
        />
      </div>
      <div className={cl(styles.field, styles.inputField)}>
        <span>Адрес</span>
        <input
          {...register('address', {
            required: true,
          })}
        />
      </div>
      <div className={cl(styles.field, styles.inputField)}>
        <span>Город</span>
        <input
          {...register('city', {
            required: true,
          })}
        />
      </div>
      <div className={cl(styles.field, styles.inputField)}>
        <span>Сетка</span>
        <select
          {...register('draw_type', { valueAsNumber: true, required: true })}
          onChange={handleDrawTypeChange}
        >
          <option>not selected</option>
          {Object.entries(TOURNAMENT_DRAW_TYPE_NUMBER_VALUES).map(
            ([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            )
          )}
        </select>
      </div>
      <div className={cl(styles.field, styles.inputField)}>
        <span>Тип турнира</span>
        <select
          {...register('tournament_type', {
            required: true,
            valueAsNumber: true,
          })}
        >
          <option>not selected</option>
          {Object.entries(TOURNAMENT_TYPE_NUMBER_VALUES).map(([key, name]) => (
            <option key={key} value={key}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className={cl(styles.field, styles.inputField)}>
        <span>Статус</span>
        <select
          {...register('status', {
            required: true,
            valueAsNumber: true,
          })}
        >
          <option>not selected</option>
          {Object.entries(TOURNAMENT_STATUS_NUMBER_VALUES).map(
            ([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            )
          )}
        </select>
      </div>
      <div className={cl(styles.field, styles.inputField)}>
        <span>Покрытие</span>
        <select
          {...register('surface', {
            required: true,
            valueAsNumber: true,
          })}
        >
          <option>not selected</option>
          <option>{SURFACE_TYPE_NUMBER_VALUES[0]}</option>
          <option value={1}>{SURFACE_TYPE_NUMBER_VALUES[1]}</option>
          <option value={2}>{SURFACE_TYPE_NUMBER_VALUES[2]}</option>
        </select>
      </div>
      <div className={cl(styles.field, styles.inputField)}>
        <span>Начало турнира</span>
        <input
          type="date"
          {...register('start_date', {
            required: false,
            valueAsDate: true,
          })}
        />
      </div>
    </form>
  );
};

export default TournamentForm;
