import { Dispatch, SetStateAction, useState } from 'react';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  Table,
} from '@tanstack/react-table';
import type { player, tournament, match } from '@prisma/client';

import { DEFAULT_PAGINATION } from 'constants/values';
import { FORM_VALUES } from 'constants/formValues';
import type { PaginationProps } from '../Pagination';

const columnHelper = createColumnHelper<player | tournament | match>();

export interface ITableProps {
  table: Table<player[] | tournament[] | match[]>;
  pagination: PaginationProps;
  setPagination: Dispatch<SetStateAction<PaginationProps>>;
  selectedRow: number;
  setSelectedRow: Dispatch<SetStateAction<number>>;
}

const useTable = (
  data: player[] | tournament[] | match[],
  columnsNames?: string[]
): ITableProps => {
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [selectedRow, setSelectedRow] = useState(-1);

  const columns = ['id', ...(columnsNames as any[])].map((name) =>
    columnHelper.accessor(name, {
      id: name,
      header: name,
      cell: (props) => props.getValue()?.toString() || '',
    })
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return {
    table: table as any,
    pagination,
    setPagination,
    selectedRow,
    setSelectedRow,
  };
};

export default useTable;
