import { Dispatch, ChangeEvent, SetStateAction } from 'react';

import type { StatsDataType } from 'pages/api/stats';
import { TOURNAMENT_TYPE_NUMBER_VALUES } from 'constants/values';
import StatsData from 'components/Stats';
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

  yearsInTennis: string;
  gameplayStyle: string;
};

const StatsTab = ({
  playerId,
  selectedLvl,
  setSelectedLvl,
  statsData,
  yearsInTennis,
  gameplayStyle,
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
      {statsData && (
        <StatsData
          p1Stats={statsData}
          p1Years={yearsInTennis}
          p1Stype={gameplayStyle}
        />
      )}
    </div>
  );
};

export default StatsTab;
