import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './Stats.module.scss';

// todo: make global lvl values
const LEVELS = ['Челленджер', 'Леджер', 'Фьючерс', 'Мастерс', 'Сеттелит'];

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

  // specs
  technique: number;
  tactics: number;
  power: number;
  shakes: number;
  serve: number;
  behaviour: number;
};

const StatsTab = (props: StatsTabProps) => {
  const [selectedLvl, setSelectedLvl] = useState(LEVELS[0]);
  const [statsData, setStatsData] = useState<any>();

  const { playerId, ...specs } = props;

  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLvl(e.target.value);
  };

  useEffect(() => {
    const fetchWrapper = async () => {
      const response = await axios.get(
        `/api/stats?playerId=${playerId}&level=${selectedLvl}`
      );

      if (response.status === 200) {
        setStatsData(response.data);
      }
    };

    // fetchWrapper()
  }, [selectedLvl, playerId]);

  return (
    <div className={styles.statsTabContainer}>
      <div className={styles.specs}>
        <p className={styles.title}>Характеристики</p>
        {Object.entries(specs).map(([k, v]) => (
          <div key={k} className={styles.inputRow}>
            <p className={styles.inputValue}>
              {trans[k]} <span className={styles.percent}>{v}%</span>
            </p>
            <input disabled className={styles.percentInput} type="range" max={100} min={0} defaultValue={v} />
          </div>
        ))}
      </div>
      <div className={styles.eloChart}>
        <i>{'<График изменение рейтинга Эло>'}</i>
      </div>
      {/* <div className={styles.eloContainer}>график рейтинга ЭЛО</div> */}
      <div className={styles.lvlSelectContainer}>
      </div>
      <div>
        <div className={styles.row}>
          <span className={styles.valueName}>Сыгранных турниров</span>
          <span className={styles.value}>14</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество титулов</span>
          <span className={styles.value}>2</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Количество сыгранных матчей в уровне
          </span>
          <span className={styles.value}>45 %</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>Количество финалов</span>
          <span className={styles.value}>4</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Количество сыгранных матчей в уровне
          </span>
          <span className={styles.value}>45 %</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>W/L в своем уровне</span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
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
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Процент побед после поражения в первом сете
          </span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Процент выигрыша 1 и 2 сетов в трехсетовике
          </span>
          <span className={styles.value}>3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Количество матчей 0-6 0-6
          </span>
          <span className={styles.value}>1</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Количество матчей 6-0 6-0
          </span>
          <span className={styles.value}>1</span>
        </div>
        <div className={styles.row}>
          <span className={styles.valueName}>
            Процент Двухсетовиков vs Трехсетовиков
          </span>
          <span className={styles.value}>3</span>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
