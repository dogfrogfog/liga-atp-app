import type { Dispatch, SetStateAction } from 'react'

import styles from './Pagination.module.scss'

export interface PaginationProps {
  pageIndex: number
  pageSize: number
}

interface IPaginationProps {
  pagination: PaginationProps,
  setPagination: Dispatch<SetStateAction<PaginationProps>>,
}

const Pagination = ({ pagination, setPagination }: IPaginationProps) => (
  <div className={styles.pagination}>
    <div className={styles.arrows}>
      <button
        onClick={() => setPagination((v) => ({ ...v, pageIndex: pagination.pageIndex - 1 }))}
        disabled={pagination.pageIndex === 0}
      >
        {'<'}
      </button>
      <button
        onClick={() => setPagination((v) => ({ ...v, pageIndex: pagination.pageIndex + 1 }))}
      >
        {'>'}
      </button>
      <button
      >
        Первая страница
      </button><button
      >
        Последняя страница
      </button>
      <select
        value={pagination.pageSize}
        onChange={e => {
          setPagination(v => ({ ...v, pageSize: Number(e.target.value) }))
        }}
      >
        {[25, 50, 75, 100, 250].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </div>
    <span className={styles.currentPage}>Страница: {pagination.pageIndex + 1}</span>
  </div>
)

export default Pagination
