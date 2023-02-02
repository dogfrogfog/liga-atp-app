import cl from 'classnames';

import type { StatsDataType } from 'pages/api/stats';
import styles from './Stats.module.scss';

const Stats = ({
  p1Stats,
  p2Stats,
  p1Years,
  p2Years,
  p1Style,
  p2Style,
}: {
  p1Stats: StatsDataType;
  p2Stats?: StatsDataType;
  p1Years: string;
  p2Years?: string;
  p1Style: string;
  p2Style?: string;
}) => {
  console.log(p1Years, p2Years, p1Style, p2Style);
  return (
    <div className={cl(styles.statsContainer, p2Stats ? styles.compare : '')}>
      <div className={styles.row}>
        {p2Stats && <span>{p2Stats?.tournaments_played || '0'}</span>}
        <span className={styles.valueName}>Турниры</span>
        <span>{p1Stats?.tournaments_played || '0'}</span>
      </div>
      <div className={styles.row}>
        {p2Stats && <span>{p2Stats?.tournaments_wins || '0'}</span>}
        <span className={styles.valueName}>Титулы</span>
        <span>{p1Stats?.tournaments_wins || '0'}</span>
      </div>
      <div className={styles.row}>
        {p2Stats && <span>{p2Stats?.tournaments_finals || '0'}</span>}

        <span className={styles.valueName}>Финалы</span>
        <span>{p1Stats?.tournaments_finals || '0'}</span>
      </div>
      <div className={styles.row}>
        {p2Stats && <span>{p2Stats?.matches_played || '0'}</span>}

        <span className={styles.valueName}>Сыгранные матчи</span>
        <span>{p1Stats?.matches_played || '0'}</span>
      </div>
      <div className={styles.row}>
        {p2Stats && <span>{p2Stats?.win_lose_in_level_proportion || '0'}</span>}

        <span className={styles.valueName}>W / L</span>
        <span>{p1Stats?.win_lose_in_level_proportion || '-'}</span>
      </div>
      <div className={styles.row}>
        {p2Years !== undefined && <span>{p2Years}</span>}
        <span>Лет в теннисе</span>
        <span>{p1Years || '0'}</span>
      </div>
      <div className={styles.row}>
        {p2Style !== undefined && <span>{p2Style}</span>}
        <span>Стиль игры</span>
        <span>{p1Style || ''}</span>
      </div>
    </div>
  );
};

export default Stats;
