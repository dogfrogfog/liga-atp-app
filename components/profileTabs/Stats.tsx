import { Dispatch, ChangeEvent, SetStateAction } from 'react';

import type { StatsDataType } from 'pages/api/stats';
import { TOURNAMENT_TYPE_NUMBER_VALUES } from 'constants/values';
import StatsData from 'components/Stats';
import styles from './Stats.module.scss';

type StatsTabProps = {
  selectedLvl: number;
  setSelectedLvl: Dispatch<SetStateAction<number>>;
  statsData?: StatsDataType;
  yearsInTennis: string;
};

const StatsTab = ({
  selectedLvl,
  setSelectedLvl,
  statsData,
  yearsInTennis,
}: StatsTabProps) => {
  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLvl(parseInt(e.target.value, 10));
  };

  return (
    <div className={styles.statsTabContainer}>
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
      {statsData && <StatsData p1Stats={statsData} p1Years={yearsInTennis} />}
    </div>
  );
};

export default StatsTab;
