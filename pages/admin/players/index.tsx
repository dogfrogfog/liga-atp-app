import { useEffect, useState } from 'react'
import type { NextPage } from 'next'

import type { core_player } from '@prisma/client'
import axios from 'axios'

import AddPlayerForm from '../forms/AddPlayerForm'
import PageTitle from '../../../ui-kit/PageTitle'
import TableControls from './components/TableControls'
import Table, { useTable } from './components/Table'
import Pagination from './components/Pagination'

const Players: NextPage = () => {
  const [data, setData] = useState<core_player[]>([])
  const [isModalOpen, setModalOpenStatus] = useState(false)
  const { pagination, setPagination, ...tableProps } = useTable(data);

  useEffect(() => {
    const fetchWrapper = async () => {
      const url = `/api/players?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`;
      const response = await axios.get<core_player[]>(url)

      if (response.status === 200) {
        setData(response.data)
      }
    }

    fetchWrapper()
  }, [pagination])

  const handleAddClick = () => {
    setModalOpenStatus(true)
  }

  return (
    <div>
      <div>
        <PageTitle>
          Управление игроками
        </PageTitle>
      </div>
      {data.length > 0 ? (
        <>
          <TableControls handleAddClick={handleAddClick} />
          <Table {...tableProps} />
          <Pagination pagination={pagination} setPagination={setPagination} />
        </>
      ) : null}
      {isModalOpen ? <AddPlayerForm setModalOpenStatus={setModalOpenStatus} /> : null}
    </div>
  )
}

export default Players
