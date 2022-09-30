import { useState, ReactNode } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import { Button, Tag } from 'antd-mobile'

import styles from './UsersList.module.scss'

interface IActionsProps {
  handleReset: any;
}

const Actions = ({ handleReset }: IActionsProps) => (
  <div className={styles.actions}>
    <Button onClick={handleReset} >Сбросить</Button>
    <Button disabled>Изменить</Button>
    <Button >Удалить</Button>
  </div>
)

const columns = [
  {
    title: 'Имя',
    dataIndex: 'name',
  },
  {
    title: 'Статус',
    dataIndex: 'status',
  },
  {
    title: 'Тек. рейтинг',
    dataIndex: 'currentRank',
  },
  {
    title: 'Уровень',
    dataIndex: 'level',
  },
];

interface DataType {
  key: React.Key;
  name: ReactNode;
  level: string;
  currentRank: number;
  status: ReactNode;
}

const data: DataType[] = [];

for (let i = 0; i < 146; i++) {
  data.push({
    key: i,
    name: <Link href={`/admin/user/${i+1}`}>Edward King</Link>,
    level: 'masters',
    currentRank: i + 1,
    status: (
      <div key={i}>
        <Tag color="red" key={i}>
          coach
        </Tag>
        <Tag color="green" key={i}>
          player
        </Tag>
        <Tag color="yellow" key={i}>
          admin
        </Tag>
      </div>
    ),
  })
}

const UsersList: NextPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([] as number[])

  const handleReset = () => {
    setSelectedRowKeys([])
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: any) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys)
      setSelectedRowKeys(newSelectedRowKeys)
    },
  }

  return (
    <div>
      <Actions handleReset={handleReset} />
      <h1>table</h1>
      {/* <Table rowSelection={rowSelection} columns={columns} dataSource={data} /> */}
    </div>
  );
}



export default UsersList
