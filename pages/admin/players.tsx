import { useState } from 'react'
import type { NextPage } from 'next'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

import PageTitle from '../../ui-kit/PageTitle'

import styles from './players.module.scss';

// should match prisma interface
type Player = {
  // id: number
  first_name: string
  last_name: string
  date_of_birth: string
  city: string
  country: string
  age: number
  job_description: string
  years_in_tennis: number
  gameplay_style: string
  forehand: string
  beckhand: string
  insta_link: string
  is_coach: boolean
  // 1st element - gold medals, 2nd element - silver medals
  medals: [number, number]
  email: string
  phone: string
  avatar: string
  level: string
}

const defaultData: Player[] = [
  {
    // id: 1,
    first_name: 'Евгений',
    last_name: 'Тищенко',
    date_of_birth: '11.06.1989',
    city: 'Minsk',
    // add flags
    country: 'Belarus',
    age: 32,
    job_description: 'Танцы',
    years_in_tennis: 6,
    gameplay_style: 'медленный',
    forehand: 'правый',
    beckhand: 'двуручный',
    insta_link: 'instagram.com/liga_tennisa',
    is_coach: false,
    medals: [0, 6],
    email: 'evgeby.ttiwenko@gmail.com',
    phone: '+375291331111',
    avatar: '<link>',
    level: 'chellenger',
  },
]

const columnHelper = createColumnHelper<Player>()

const columns = [
  columnHelper.accessor('first_name', {
    header: 'first_name',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('last_name', {
    header: 'last_name',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('date_of_birth', {
    header: 'date_of_birth',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('city', {
    header: 'city',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('country', {
    header: 'country',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('age', {
    header: 'age',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('job_description', {
    header: 'job_description',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('years_in_tennis', {
    header: 'years_in_tennis',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('gameplay_style', {
    header: 'gameplay_style',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('forehand', {
    header: 'forehand',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('beckhand', {
    header: 'beckhand',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('insta_link', {
    header: 'insta_link',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('is_coach', {
    header: 'is_coach',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('medals', {
    header: 'medals',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('email', {
    header: 'email',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('phone', {
    header: 'phone',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('avatar', {
    header: 'avatar',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('avatar', {
    header: 'avatar',
    footer: info => info.column.id,
  }),
]

const Table = () => {
  const [data, setData] = useState(() => [...defaultData])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className={styles.tableContainer}>
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              <td>
                <input type="checkbox" />
              </td>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              <td>
                <input type="checkbox" />
              </td>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {/* <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.footer,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot> */}
      </table>
    </div>
  )
}

const Players: NextPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.tableControls}>
        <PageTitle>
          Управление игроками
        </PageTitle>
        <div className={styles.buttons}>
          <button>
            delete
          </button>
          <button>
            update
          </button>
        </div>
      </div>
      <Table />
    </div>
  )
}

export default Players
