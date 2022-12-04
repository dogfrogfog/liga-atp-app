import type { FC } from 'react';

import styles from './TableControls.module.scss';

interface ITableControlsProps {
  selectedRow: number;
  handlePickClick?: any;
  handleAddClick: any;
  handleUpdateClick: any;
  handleResetClick: any;
  handleDeleteClick: any;
}

// todo: add disabled state (when editting or loading)
const TableControls: FC<ITableControlsProps> = ({
  selectedRow,
  handlePickClick,
  handleAddClick,
  handleUpdateClick,
  handleDeleteClick,
  handleResetClick,
}) => {
  return (
    <div className={styles.tableControls}>
      {handlePickClick ? (
        <button
          disabled={selectedRow === -1}
          className={styles.pick}
          onClick={handlePickClick}
        >
          Выбрать
        </button>
      ) : null}
      <button className={styles.add} onClick={handleAddClick}>
        Добавить
      </button>
      <button
        disabled={selectedRow === -1}
        className={styles.update}
        onClick={handleUpdateClick}
      >
        Обновить
      </button>
      <button
        disabled={selectedRow === -1}
        className={styles.delete}
        onClick={handleDeleteClick}
      >
        Удалить
      </button>
      <button
        disabled={selectedRow === -1}
        className={styles.reset}
        onClick={handleResetClick}
      >
        Снять выделение
      </button>
    </div>
  );
};

export default TableControls;
