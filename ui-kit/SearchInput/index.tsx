import type { ChangeEvent, FC } from 'react';
import { FiSearch } from 'react-icons/fi';

import styles from './styles.module.scss';

interface ISearchInputProps {
  handleSearch: (v: string) => void;
  placeholder: string;
}

const SearchInput: FC<ISearchInputProps> = ({ handleSearch, placeholder }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    console.log(handleSearch);
  };

  return (
    <div className={styles.searchInput}>
      <button
        // onClick={submitSearch}
        className={styles.searchIcon}
      >
        <FiSearch />
      </button>
      <input
        onChange={handleInputChange}
        className={styles.input}
        placeholder={placeholder}
      // value={search}
      // onChange={handleSearch}
      />
      {/* <button
      onClick={() => setIsOpen(true)}
      className={styles.filterButton}
    >
      <FiMenu />
    </button> */}
    </div>
  );
};

export default SearchInput;
