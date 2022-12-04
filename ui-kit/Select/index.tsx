import type { ChangeEvent, FC } from 'react';

import styles from './styles.module.scss';

interface ISelectProps {
  handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void,
  value: number | string;
  name: string;
  options: [value: number, name: string][];
}

const Select: FC<ISelectProps> = ({ name, value, options, handleSelectChange }) => (
  <div className={styles.select}>
    <select
      onChange={handleSelectChange}
      className={styles.selectInput}
      name={name}
      value={value}
    >
      <option value="">Не выбрано</option>
      {options.map(([value, name]) => (
        <option key={value} value={value}>{name}</option>
      ))}
    </select>
  </div>
);

export default Select;
