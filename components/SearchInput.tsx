import { ChangeEvent, useState } from 'react';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { AiOutlineClose } from 'react-icons/ai';

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

  const toggleDropdown = () => setDropdownStatus((v) => !v);

  return (
    <div className={styles.container}>
      <div className={styles.searchInput}>
        <button onClick={submitSearch} className={styles.searchButton}>
          <FiSearch />
        </button>
        <Input
          className={isDropdownOpen ? styles.inputWithDropdown : ''}
          placeholder="Введите имя игрока"
          value={value}
          onChange={handleChange}
        />
        <button onClick={toggleDropdown} className={styles.filterButton}>
          {isDropdownOpen ? <AiOutlineClose /> : <FiMenu />}
        </button>
      </div>
      {isDropdownOpen && (
        <div className={styles.searchDropdown}>
          {[
            '<фильтр 1>',
            '<фильтр 2>',
            '<фильтр 3>',
            '<фильтр 4>',
            '<фильтр 5>',
          ].map((v) => (
            <p className={styles.filter} key={v}>
              {v}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
