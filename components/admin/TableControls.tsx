import styles from './TableControls.module.scss';

type TableControlsProps = {
  isLoading: boolean;
  selectedRow: number;
  handlePickClick?: () => void;
  handleAddClick: () => void;
  handleUpdateClick: () => void;
  handleResetClick: () => void;
  handleDeleteClick: () => void;
};

const TableControls = ({
  isLoading,
  selectedRow,
  handlePickClick,
  handleAddClick,
  handleUpdateClick,
  handleDeleteClick,
  handleResetClick,
}: TableControlsProps) => {
  const isDisabled = selectedRow === -1 || isLoading;
  return (
    <div className={styles.tableControls}>
      {handlePickClick ? (
        <button
          disabled={isDisabled}
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
        disabled={isDisabled}
        className={styles.update}
        onClick={handleUpdateClick}
      >
        Обновить
      </button>
      <button
        disabled={isDisabled}
        className={styles.delete}
        onClick={handleDeleteClick}
      >
        Удалить
      </button>
      <button
        disabled={isDisabled}
        className={styles.reset}
        onClick={handleResetClick}
      >
        Снять выделение
      </button>
    </div>
  );
};

export default TableControls;
