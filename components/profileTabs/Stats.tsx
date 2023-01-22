import { Dispatch, ChangeEvent, SetStateAction } from 'react';

import type { StatsDataType } from 'pages/api/stats';
import { TOURNAMENT_TYPE_NUMBER_VALUES } from 'constants/values';
import styles from './Stats.module.scss';

const trans: { [k: string]: string } = {
  technique: 'Техника',
  tactics: 'Тактика',
  power: 'Мощь',
  shakes: 'Кач',
  serve: 'Подача',
  behaviour: 'Поведение',
};

type StatsTabProps = {
  playerId: number;
  selectedLvl: number;
  setSelectedLvl: Dispatch<SetStateAction<number>>;

  statsData?: StatsDataType;

  // specs
  technique: number;
  tactics: number;
  power: number;
  shakes: number;
  serve: number;
  behaviour: number;
};

const StatsTab = ({
  playerId,
  selectedLvl,
  setSelectedLvl,
  statsData,
  ...rest
}: StatsTabProps) => {
  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLvl(parseInt(e.target.value, 10));
  };

  return (
    <div className={styles.statsTabContainer}>
      <div className={styles.specs}>
        <p className={styles.title}>Характеристики</p>
        {Object.entries(rest).map(([k, v]) => (
          <div key={k} className={styles.inputRow}>
            <p className={styles.inputValue}>
              {trans[k]} <span className={styles.percent}>{v}%</span>
            </p>
            <input
              disabled
              className={styles.percentInput}
              type="range"
              max={100}
              min={0}
              defaultValue={v}
            />
          </div>
        ))}
      </div>
      <div className={styles.levelContainer}>
        <select value={selectedLvl} onChange={handleLevelChange} name="level">
          <option key={999} value={999}>
            Все
          </option>
          {Object.entries(TOURNAMENT_TYPE_NUMBER_VALUES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.lvlSelectContainer}></div>
      <div>
        <div className={styles.row}>
          <span className={styles.valueName}>Сыгранных турниров</span>
          <span className={styles.value}>
            {statsData?.tournaments_played || '-'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество титулов</span>
          <span className={styles.value}>
            {statsData?.tournaments_wins || '-'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество финалов</span>
          <span className={styles.value}>
            {statsData?.finals_number || '-'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество сыгранных матчей</span>
          <span className={styles.value}>
            {statsData?.matches_played_in_level || '-'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>W/L</span>
          <span className={styles.value}>
            {statsData?.win_lose_in_level_proportion || '-'}
          </span>
        </div>
        {/* <div className={styles.row}>
          <span className={styles.valueName}>
            Процент выигрыша в тай-брейков до 7
          </span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Процент выигрыша решающих тай-брейков
          </span>
          <span className={styles.value}>3</span>
        </div> */}
        <div className={styles.row}>
          <span className={styles.valueName}>
            Процент побед после поражения в первом сете
          </span>
          <span className={styles.value}>
            {statsData?.win_lose_with_first_set_lose_proportion || '-'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество матчей 0-6 0-6</span>
          <span className={styles.value}>
            {statsData?.lose_matches_with_zero_points || '-'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество матчей 6-0 6-0</span>
          <span className={styles.value}>
            {statsData?.win_matches_with_zero_opponent_points || '-'}
          </span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Процент Двухсетовиков vs Трехсетовиков
          </span>
          <span className={styles.value}>
            {statsData?.two_three_sets_matches_proportion || '-'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
