import { ChangeEvent, useState } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';

import Input from 'ui-kit/Input';
import styles from './SearchInput.module.scss';

type SearchInputProps = {
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  submitSearch: () => void;
};

const SearchInput = ({
  value,
  handleChange,
  submitSearch,
}: SearchInputProps) => {
  const [isDropdownOpen, setDropdownStatus] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.searchInput}>
        <button onClick={submitSearch} className={styles.searchButton}>
          <FiSearch />
        </button>
        <Input
          placeholder="Введите имя игрока"
          value={value}
          onChange={handleChange}
        />
        <button
          onClick={() => setDropdownStatus(true)}
          className={styles.filterButton}
        >
          <FiMenu />
        </button>
      </div>
      {isDropdownOpen && (
        <div className={styles.searchDropdown}>
          <button
            onClick={() => setDropdownStatus(false)}
            className={styles.filterButton}
          >
            <FiMenu />
          </button>
          <ul>
            <p>Фильтр по категориям</p>
            {[
              'Топ 10 игроков Лиги',
              'Рейтинг ЭЛО',
              'Количество сыгранных матчей',
              'Процент выигранных тай-брейков',
              'Среднее число ударов',
            ].map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
