import styles from './StatsTab.module.scss';

const StatsTab = () => {
  return (
    <>
      {[
        'Техничность',
        'Тактика',
        'Стабильность',
        'Стиль игры',
        'Кол-во матчей',
        'Сыграно часов',
        'Тай-брейки',
        'Решающие тай-брейки',
      ].map((statName) => (
        <div key={statName} className={styles.row}>
          <div className={styles.value}>10 %</div>
          <div className={styles.centerName}>{statName}</div>
          <div className={styles.value}>45 %</div>
        </div>
      ))}
    </>
  );
};

export default StatsTab;
