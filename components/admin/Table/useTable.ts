import { Dispatch, SetStateAction, useState } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  Table,
} from '@tanstack/react-table'
import type { player, tournament, match } from '@prisma/client'

import type { PaginationProps } from '../Pagination'
import { FORM_VALUES } from '../../../constants/values'

const columnHelper = createColumnHelper()

export interface ITableProps {
  table: Table<player[] | tournament[] | match[]>
  pagination: PaginationProps
  setPagination: Dispatch<SetStateAction<PaginationProps>>,
  selectedRow: number,
  setSelectedRow: Dispatch<SetStateAction<number>>,
}

// todo: refactor types
const useTable = (
  type: 'tournaments' | 'players' | 'matches',
  data: player[] | tournament[] | match[],
): ITableProps => {
  // const [sorting, setSorting] = useState<any>([])
  const [pagination, setPagination] = useState<PaginationProps>({ pageIndex: 0, pageSize: 25 })
  // todo: think of storing id's instead of current page indexes
  const [selectedRow, setSelectedRow] = useState(-1)

  const columns = [{ name: 'id' }, ...FORM_VALUES[type]].map(({ name }) => (
    columnHelper.accessor(name, {
      header: name,
    })))

  const table = useReactTable({
    data,
    columns,
    // state: {
    //   sorting,
    // },
    // onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return {
    table: table as any,
    pagination,
    setPagination,
    selectedRow,
    setSelectedRow,
  }
}

export default useTable
