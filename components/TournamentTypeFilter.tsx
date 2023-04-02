import { TOURNAMENT_TYPE_NUMBER_VALUES } from 'constants/values';
import styles from './TournamentTypeFilter.module.scss';

type TournamentTypeFilterProps = {
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    tournamentTypeValue: number;
}

const TournamentTypeFilter = ({ onChange, tournamentTypeValue }: TournamentTypeFilterProps) => {
    return (
        <div className={styles.finishedTournamentsFilters}>
        <div className={styles.tournamentType}>
          <span>Тип турнира</span>
          <select
            onChange={onChange}
            value={tournamentTypeValue}
          >
            <option value={999}>Все</option>
            {Object.entries(TOURNAMENT_TYPE_NUMBER_VALUES).map(
              ([key, name]) => {
                return (
                  <option key={key} value={key}>
                    {name as string}
                  </option>
                );
              }
            )}
          </select>
        </div>
      </div>
    )
}

export default TournamentTypeFilter;