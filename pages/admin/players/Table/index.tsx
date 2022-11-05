import camelize from 'camelize-ts'
import { flexRender } from '@tanstack/react-table'

import TableControls from './TableControls'
import Pagination from './Pagination'
import useTable, { ITableProps } from './useTable'

import styles from './Table.module.scss'

const TableWrapper = ({
  table,
  selectedPlayer,
  setSelectedPlayer,
  pagination,
  setPagination,
}: ITableProps) => {
  return (
    <div>
      <TableControls />
      <Table
        table={table}
        selectedPlayer={selectedPlayer}
        setSelectedPlayer={setSelectedPlayer}
      />
      <Pagination pagination={pagination} setPagination={setPagination} />
    </div>
  )
}

export { useTable };
export default TableWrapper

const TableHead = ({ table }: { table: ITableProps['table'] }) => (
  <thead>
    {table.getHeaderGroups().map((headerGroup, index) => (
      <tr key={headerGroup.id + index}>
        <td />
        {headerGroup.headers.map((header) => (
          <th
            key={header.id}
            onClick={header.column.getToggleSortingHandler()}
          >
            {flexRender(
              header.column.columnDef.header,
              header.getContext()
            )}
            {{
              asc: ' 🔼',
              desc: ' 🔽',
            }[header.column.getIsSorted() as string] ?? null}
          </th>
        ))}
      </tr>
    ))}
  </thead>
)

// const handleResetClick = () => {
//   setEditingStatus(false)
//   setSelectedPlayer(undefined)
// }

// const openCreatePlayerForm = async () => {
//   setEditingStatus(true)
//   setSelectedPlayer(undefined)
// }

const Table = ({
  table,
  selectedPlayer,
  setSelectedPlayer,
}: {
  table: ITableProps['table'];
  selectedPlayer: ITableProps['selectedPlayer'],
  setSelectedPlayer: ITableProps['setSelectedPlayer'],
}) => {

  const handleCheckboxClick = (index: number) => {
    setSelectedPlayer(v => v === index ? -1 : index)
  }

  // console.log(table.getRowModel().rows)

  return (
    <div className={styles.tableContainer}>
      <table>
        <TableHead table={table} />
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id + index}
              className={selectedPlayer === index ? styles.selectedRow : ''}
            >
              <td key="checkbox">
                <input
                  checked={selectedPlayer === index}
                  onChange={() => handleCheckboxClick(index)} type="checkbox"
                />
              </td>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

