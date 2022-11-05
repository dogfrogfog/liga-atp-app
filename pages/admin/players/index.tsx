import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { useForm } from 'react-hook-form'

import type { core_player } from '@prisma/client'
import axios from 'axios'
// import PlayerForm from '../forms/PlayerForm'

import PageTitle from '../../../ui-kit/PageTitle'

import Table, { useTable } from './Table';

const Players: NextPage = () => {
  const [data, setData] = useState<core_player[]>([])
  const useFormProps = useForm<core_player>();
  const tableProps = useTable(data);

  useEffect(() => {
    const { pagination } = tableProps;
    const fetchWrapper = async () => {
      const url = `/api/players?take=${pagination.pageSize}&skip=${pagination.pageIndex * pagination.pageSize}`;
      const response = await axios.get<core_player[]>(url)

      if (response.status === 200) {
        setData(response.data)
      }
    }

    fetchWrapper()
  }, [tableProps.pagination])

  return (
    <div>
      <div>
        <PageTitle>
          Управление игроками
        </PageTitle>
      </div>
      {/* <PlayerForm {...useFormProps} /> */}
      {data.length > 0 ? <Table {...tableProps} /> : null}
    </div>
  )
}

export default Players
