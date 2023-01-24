import cl from 'classnames';

import type { StatsDataType } from 'pages/api/stats';
import styles from './Stats.module.scss';

const Stats = ({
  p1Stats,
  p2Stats,
}: {
  p1Stats: StatsDataType;
  p2Stats?: StatsDataType;
}) => {
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
        {p2Stats && <span>{p2Stats?.lose_with_zero_points || '0'}</span>}

        <span className={styles.valueName}>Матчи 0-6 0-6</span>
        <span>{p1Stats?.lose_with_zero_points || '0'}</span>
      </div>
      <div className={styles.row}>
        {p2Stats && <span>{p2Stats?.win_with_zero_points || '0'}</span>}

        <span className={styles.valueName}>Матчи 6-0 6-0</span>
        <span>{p1Stats?.win_with_zero_points || '0'}</span>
      </div>
      <div className={styles.row}>
        {p2Stats && (
          <span>{p2Stats?.two_three_sets_matches_proportion || '0/0'}</span>
        )}

        <span className={styles.valueName}>2-сетовики / 3-сетовики</span>
        <span>{p1Stats?.two_three_sets_matches_proportion || '0/0'}</span>
      </div>
    </div>
  );
};

export default Stats;
