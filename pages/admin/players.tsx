import { useEffect, useState } from 'react'
import type { NextPage } from 'next'

import type { core_player } from '@prisma/client'
import axios from 'axios'

import DataForm from '../../components/admin/DataForm'
import PageTitle from '../../ui-kit/PageTitle'
import TableControls from '../../components/admin/TableControls'
import Table, { useTable } from '../../components/admin/Table'
import Pagination from '../../components/admin/Pagination'

// todo: add multiple checkboxes + multiple delete
const deleteSelectedPlayers = async (ids: number[]) => {
  const response = await axios.delete('/api/players/', { data: ids });

  if (response.status === 200) {
    console.log('players was deleted');
  }
}

const Players: NextPage = () => {
  const [data, setData] = useState<core_player[]>([])
  const [modalStatus, setModalStatus] = useState({ isOpen: false, type: '' })
  const { pagination, setPagination, ...tableProps } = useTable('players', data);
  const [editingUser, setEditingUser] = useState()

  useEffect(() => {
    const fetchWrapper = async () => {
      const url = `/api/players?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`
      const response = await axios.get<core_player[]>(url)

      if (response.status === 200) {
        setData(response.data)
      }
    }

    fetchWrapper()
  }, [pagination])

  // todo: create 1 clenup function

  const handleAddClick = () => {
    setEditingUser(undefined)
    setModalStatus({ type: 'add', isOpen: true })
  }

  const handleDeleteClick = async () => {
    // todo: fix delete + prisma delete: cascade delete
    // await deleteselectedRows([330])
  }

  const handleResetClick = () => {
    tableProps.setSelectedRow(-1)
    setEditingUser(undefined)
  }

  const handleUpdateClick = () => {
    const updatingPlayerData = data[tableProps.selectedRow];

    setModalStatus({ isOpen: true, type: 'update' })
    setEditingUser(updatingPlayerData as any);
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
          <TableControls
            selectedRow={tableProps.selectedRow}
            handleAddClick={handleAddClick}
            handleUpdateClick={handleUpdateClick}
            handleDeleteClick={handleDeleteClick}
            handleResetClick={handleResetClick}
          />
          <Table {...tableProps} />
          <Pagination pagination={pagination} setPagination={setPagination} />
        </>
      ) : null}
      {/* // todo: make reusable form/fields */}
      {modalStatus.isOpen ?
        <DataForm
          modalStatus={modalStatus}
          setModalStatus={setModalStatus}
          pagination={pagination}
          setData={setData}
          editingRow={editingUser}
        />
        : null}
    </div>
  )
}

export default Players
