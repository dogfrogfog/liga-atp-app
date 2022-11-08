import { useEffect, useState } from 'react'
import type { NextPage } from 'next'

import type { core_tournament } from '@prisma/client'
import axios from 'axios'

import PageTitle from '../../ui-kit/PageTitle'
import TableControls from '../../components/admin/TableControls'
import Table, { useTable } from '../../components/admin/Table'
import Pagination from '../../components/admin/Pagination'

const Tournaments: NextPage = () => {
  const [data, setData] = useState<core_tournament[]>([])
  const [modalStatus, setModalStatus] = useState({ isOpen: false, type: '' })
  const { pagination, setPagination, ...tableProps } = useTable('tournaments', data);
  const [editingTournament, setEditingTournament] = useState()

  useEffect(() => {
    const fetchWrapper = async () => {
      const url = `/api/tournaments?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`
      const response = await axios.get<core_tournament[]>(url)

      if (response.status === 200) {
        setData(response.data)
      }
    }

    fetchWrapper()
  }, [pagination])

  return (
    <div>
      <div>
        <PageTitle>
          Управление турнирами
        </PageTitle>
      </div>
      {data.length > 0 ? (
        <>
          <TableControls
            selectedRow={tableProps.selectedRow}
            handleAddClick={() => ({})}
            handleUpdateClick={() => ({})}
            handleDeleteClick={() => ({})}
            handleResetClick={() => ({})}
          />
          <Table {...tableProps} />
          <Pagination pagination={pagination} setPagination={setPagination} />
        </>
      ) : null}
      {/* // todo: make reusable form/fields */}
      {/* {modalStatus.isOpen ?
        <PlayerForm
          pagination={pagination}
          setData={setData}
          editingUser={editingUser}
          modalStatus={modalStatus}
          setModalStatus={setModalStatus}
        />
        : null} */}
    </div>
  )
}

export default Tournaments
