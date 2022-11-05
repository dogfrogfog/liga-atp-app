import type { FC } from 'react'

import styles from './TableControls.module.scss'

interface ITableControlsProps {
  handleAddClick: any;
}

// todo: add disabled state (when editting or loading)
const TableControls: FC<ITableControlsProps> = ({
  handleAddClick,
}) => {
  return (
    <div className={styles.tableControls}>
      <button
        style={{ backgroundColor: 'blue', color: 'white' }}
        onClick={handleAddClick}
      >
        add player
      </button>
      {/* onClick={() => setEditingStatus(true)}  */}
      <button style={{ backgroundColor: 'yellow' }}>
        edit
      </button>
      <button style={{ backgroundColor: 'green' }}>
        update
      </button>
      <button style={{ backgroundColor: 'red' }}>
        delete
      </button>
      {/* onClick={handleResetClick}  */}
      <button style={{ backgroundColor: 'grey', color: 'white' }}>
        reset
      </button>
    </div>
  )
}

export default TableControls
