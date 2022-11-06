import { Dispatch, SetStateAction, useState } from 'react'
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  Table,
} from '@tanstack/react-table'
import type { core_player } from '@prisma/client'

import type { PaginationProps } from '../Pagination'
import { PLAYER_FORM_VALUES } from '../../../constants/values'

const columnHelper = createColumnHelper()
const columns = PLAYER_FORM_VALUES.map(({ name }) => (
  columnHelper.accessor(name, {
    header: name,
  })
))

export interface ITableProps {
  table: Table<core_player[]>
  pagination: PaginationProps
  setPagination: Dispatch<SetStateAction<PaginationProps>>,
  selectedPlayer: number,
  setSelectedPlayer: Dispatch<SetStateAction<number>>,
}

const useTable = (data: core_player[]): ITableProps => {
  // const [sorting, setSorting] = useState<any>([])
  const [pagination, setPagination] = useState<PaginationProps>({ pageIndex: 0, pageSize: 25 })
  // todo: think of storing store id's instead of current page indexes
  const [selectedPlayer, setSelectedPlayer] = useState(-1)

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
    selectedPlayer,
    setSelectedPlayer,
  }
}

export default useTable
