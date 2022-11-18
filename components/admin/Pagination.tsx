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
        disabled={pagination.pageIndex === 0}
        onClick={() => setPagination((v) => ({ ...v, pageIndex: 0}))}
      >
        {'<<'}
      </button>
      <button
        onClick={() => setPagination((v) => ({ ...v, pageIndex: pagination.pageIndex - 1 }))}
        disabled={pagination.pageIndex === 0}
      >
        {'<'}
      </button>
      <span className={styles.currentPage}>{pagination.pageIndex + 1}</span>
      <button
        disabled={false}
        onClick={() => setPagination((v) => ({ ...v, pageIndex: pagination.pageIndex + 1 }))}
      >
        {'>'}
      </button>
      <button
        disabled={false}
        onClick={() => setPagination((v) => ({ ...v, pageIndex: 850 / Math.ceil(pagination.pageSize) }))}
      >
        {'>>'}
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
  </div>
)

export default Pagination
