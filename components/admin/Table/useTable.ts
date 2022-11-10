import { Dispatch, SetStateAction, useState } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  Table,
} from '@tanstack/react-table'
import type { player, tournament, match } from '@prisma/client'

import { FORM_VALUES, DEFAULT_PAGINATION } from 'constants/values'
import type { PaginationProps } from '../Pagination'

const columnHelper = createColumnHelper()

export interface ITableProps {
  table: Table<player[] | tournament[] | match[]>
  pagination: PaginationProps
  setPagination: Dispatch<SetStateAction<PaginationProps>>,
  selectedRow: number,
  setSelectedRow: Dispatch<SetStateAction<number>>,
}

const useTable = (
  type: 'tournaments' | 'players' | 'matches',
  data: player[] | tournament[] | match[],
): ITableProps => {
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [selectedRow, setSelectedRow] = useState(-1)

  const columns = [{ name: 'id' }, ...FORM_VALUES[type]].map(({ name, options }) => (
    columnHelper.accessor(name, {
      header: name,
      cell: (props) => options ? options[props.getValue() as number] : props.getValue(),
    })
  ));

  const table = useReactTable({
    data,
    columns,
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
