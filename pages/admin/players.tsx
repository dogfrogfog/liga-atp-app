import { useEffect, useState } from 'react'
import type { NextPage } from 'next'

import type { player } from '@prisma/client'
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

const createPlayer = async (player: player) => {
  const response = await axios.post('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, message: 'player was successfully screated' }
  } else {
    return { isOk: false, message: response.statusText }
  }
}

const updatePlayer = async (player: player) => {
  const response = await axios.put('/api/players', { data: player });

  if (response.status === 200) {
    return { isOk: true, message: 'player was successfully updated' }
  } else {
    return { isOk: false, message: response.statusText }
  }
}

const Players: NextPage = () => {
  const [data, setData] = useState<player[]>([])
  const [modalStatus, setModalStatus] = useState({ isOpen: false, type: '' })
  const { pagination, setPagination, ...tableProps } = useTable('players', data);
  const [editingUser, setEditingUser] = useState()

  useEffect(() => {
    const fetchWrapper = async () => {
      const url = `/api/players?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`
      const response = await axios.get<player[]>(url)

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

  const fetchWrapper = async () => {
    const url = `/api/players?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`
    const response = await axios.get<player[]>(url)

    if (response.status === 200) {
      setData(response.data)
    }
  }

  // todo: add notifications (ui-kit component + use it here)
  const onSubmit = async (v: any) => {
    if (modalStatus.type === 'add') {
      //todo: refactor and provide real data when postgres cc @corpsolovei types are ready
      const { isOk, message } = await createPlayer({ ...v, medals: 1, level: 1, is_coach: 0, avatar: 'linkkk' })

      if (isOk) {
        setModalStatus({ type: '', isOpen: false });

        fetchWrapper()
      } else {
        console.warn(message)
      }
    }

    if (modalStatus.type === 'update') {
      const { isOk, message } = await updatePlayer({ ...v, medals: 1, level: 1, is_coach: 0, avatar: 'linkkk' })
      if (isOk) {
        setModalStatus({ type: '', isOpen: false })

        fetchWrapper()
      } else {
        console.warn(message)
      }
    }
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
      {modalStatus.isOpen ?
        <DataForm
          onSubmit={onSubmit}
          setModalStatus={setModalStatus}
          editingRow={editingUser}
          type="players"
        />
        : null}
    </div>
  )
}

export default Players
