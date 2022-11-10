import { flexRender } from '@tanstack/react-table'

import useTable, { ITableProps } from './useTable'
import styles from './Table.module.scss'

const Table = ({
  table,
  selectedRow,
  setSelectedRow,
}: {
  table: ITableProps['table'];
    selectedRow: ITableProps['selectedRow'],
    setSelectedRow: ITableProps['setSelectedRow'],
}) => {

  const handleCheckboxClick = (index: number) => {
    setSelectedRow(v => v === index ? -1 : index)
  }

  return (
    <div className={styles.table}>
      <table>
        <TableHead table={table} />
        <tbody>
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id + index}
              className={selectedRow === index ? styles.selectedRow : ''}
            >
              <td key="checkbox">
                <input
                  checked={selectedRow === index}
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

export default Table
export { useTable }
