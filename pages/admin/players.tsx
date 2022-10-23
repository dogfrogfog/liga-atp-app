import { useEffect, useState, Dispatch, SetStateAction, ChangeEvent } from 'react'
import type { NextPage } from 'next'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  Table as TypeTable,
} from '@tanstack/react-table'
import { core_player } from '@prisma/client'
import axios from 'axios'

import PageTitle from '../../ui-kit/PageTitle'

import styles from './players.module.scss';
// import { GiConsoleController } from 'react-icons/gi'

const fieslds = [
  'id',
  'first_name',
  'last_name',
  'date_of_birth',
  'city',
  'country',
  'age',
  'job_description',
  'years_in_tennis',
  'gameplay_style',
  'forehand',
  'beckhand',
  'insta_link',
  'is_coach',
  'medals',
  'email',
  'phone',
  'avatar',
  'level'
];

const columnHelper = createColumnHelper<any>()

const columns = fieslds.map((fiesld) => (
  columnHelper.accessor(fiesld, {
    header: fiesld,
  })
))

interface PaginationProps {
  pageIndex: number
  pageSize: number
}

const Pagination = ({
  setPagination,
  pagination,
}: {
  pagination: PaginationProps,
  setPagination: Dispatch<SetStateAction<PaginationProps>>,
}) => (
  <div className={styles.paginationContainer}>
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
      <select
        value={pagination.pageSize}
        onChange={e => {
          setPagination(v => ({ ...v, pageSize: Number(e.target.value) }))
        }}
      >
        {[25, 50, 75, 100].map(pageSize => (
          <option key={pageSize} value={pageSize}>
            {pageSize}
          </option>
        ))}
      </select>
    </div>
  </div>
)

const Table = ({
  table,
  selectedPlayer,
  handleCheckboxClick,
  pagination,
  setPagination,
}: {
  table: TypeTable<core_player>;
  selectedPlayer: any,
    handleCheckboxClick: (v: any) => void,
  pagination: PaginationProps;
  setPagination: Dispatch<SetStateAction<PaginationProps>>;
}) => (
  <div className={styles.tableContainer}>
    <table>
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
    <Pagination pagination={pagination} setPagination={setPagination} />
  </div>
)

const createPlayer = async (player: core_player) => {
  console.log(player)
}

const AddPlayerRow = ({ formValue, setPlayerForm }: any) => {
  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerForm((v: any) => ({ ...v, [e.target.name]: e.target.value }))
  }

  return (
    <>
      {fieslds.map((fieldName) => {
        if (fieldName !== 'id') {
          return (
            <input
              key={fieldName}
              type='text'
              onChange={handleFormChange}
              placeholder={fieldName}
              value={formValue[fieldName]}
              name={fieldName}
            />
          )
        }
      })}
      <button onClick={() => createPlayer(formValue)}>submit</button>
    </>
  )
}

const Players: NextPage = () => {
  const [data, setData] = useState<any[]>([])
  const [sorting, setSorting] = useState<any>([])
  const [pagination, setPagination] = useState<PaginationProps>({ pageIndex: 0, pageSize: 25 })
  const [selectedPlayer, setSelectedPlayer] = useState<number | undefined>()
  const [isEditing, setEditingStatus] = useState(false)
  const [playerForm, setPlayerForm] = useState<any>()

  useEffect(() => {
    const fetchWrapper = async () => {
      const response = await axios.get(`/api/players?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`)

      if (response.status === 200) {
        setData(response.data)
      }
    }

    fetchWrapper()
  }, [pagination])
  
  const table = useReactTable<any>({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const handleResetClick = () => {
    setEditingStatus(false)
    setSelectedPlayer(undefined)
    setPlayerForm(undefined)
  }

  const handleAddPlayerClick = () => {
    setEditingStatus(true)
    setPlayerForm({})
    setSelectedPlayer(undefined)
  }

  const handleCheckboxClick = (index: number) => {
    setPlayerForm(undefined)
    setSelectedPlayer(v => v === index ? undefined : index)
  }

  // add isLoading
  const isDisabled = selectedPlayer === undefined;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.tableControls}>
        <PageTitle>
          Управление игроками
        </PageTitle>
        <div className={styles.buttons}>
          <button
            disabled={isEditing}
            style={{ backgroundColor: 'blue', color: 'white' }}
            onClick={handleAddPlayerClick}
          >
            add player
          </button>
          <button disabled={isDisabled} onClick={() => setEditingStatus(true)} style={{ backgroundColor: 'yellow' }}>
            edit
          </button>
          <button disabled={isDisabled} style={{ backgroundColor: 'green' }}>
            update
          </button>
          <button disabled={isDisabled} style={{ backgroundColor: 'red' }}>
            delete
          </button>
          <button onClick={handleResetClick} style={{ backgroundColor: 'grey', color: 'white' }}>
            reset
          </button>
        </div>
      </div>
      {playerForm && <AddPlayerRow formValue={playerForm} setPlayerForm={setPlayerForm} />}
      <Table
        // @ts-ignore
        table={table}
        selectedPlayer={selectedPlayer}
        handleCheckboxClick={handleCheckboxClick}
        pagination={pagination}
        setPagination={setPagination}
      />
    </div>
  )
}

export default Players
