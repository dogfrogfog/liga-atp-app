import { TOURNAMENT_TYPE_NUMBER_VALUES } from 'constants/values';
import styles from './TournamentTypeFilter.module.scss';

type TournamentTypeFilterProps = {
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  tournamentTypeValue: number;
};

const TournamentTypeFilter = ({
  onChange,
  tournamentTypeValue,
}: TournamentTypeFilterProps) => {
  return (
    <div className={styles.finishedTournamentsFilters}>
      <div className={styles.tournamentType}>
        <span>Тип турнира</span>
        <select onChange={onChange} value={tournamentTypeValue}>
          <option value={999}>Все</option>
          {/* order matters here */}
          {[
            [1, 'Про'],
            [11, 'S-мастерс'],
            [2, 'Мастерс'],
            [3, 'Челленджер'],
            [6, 'Леджер'],
            [4, 'Фьючерс'],
            [5, 'Сателлит'],
            [101, 'Парный ProAm'],
            [22, 'Парный Про'],
            [20, 'Парный Мастерс'],
            [18, 'Парный Челенджер'],
            [15, 'Парный Леджер'],
            [14, 'Парный Фьючерс'],
            [13, 'Парный Суперсателлит'],
            [12, 'Парный Сателлит'],
            [7, 'Тайбрейк'],
            [0, 'Большой Шлем'],
            [23, 'Парный Большой Шлем'],
            [100, 'Итоговый Турнир'],
          ].map(([key, name]) => {
            return (
              <option key={key} value={key}>
                {name as string}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
};

export default TournamentTypeFilter;
