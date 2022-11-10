import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';

import TableControls from '../../components/admin/TableControls';
import Table, { useTable } from '../../components/admin/Table';
import DataForm from '../../components/admin/DataForm';
import Pagination from '../../components/admin/Pagination';
import { DEFAULT_MODAL } from '../../constants/values';
import { getPlayers, createPlayer, updatePlayer } from '../../services/players';
import PageTitle from '../../ui-kit/PageTitle';

const Players: NextPage<{ players: PlayerT[] }> = ({ players = [] }) => {
  const [data, setData] = useState(players);
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);
  const [editingUser, setEditingUser] = useState<undefined | PlayerT>();
  const { pagination, setPagination, ...tableProps } = useTable('players', data);

  useEffect(() => {
    const fetchWrapper = async () => {
      const res = await getPlayers(pagination);

      if (res.isOk) {
        setData(res.data as PlayerT[]);
      }
    };

    fetchWrapper()
  }, [pagination])

  const handleReset = () => {
    tableProps.setSelectedRow(-1);
    setEditingUser(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const handleAddClick = () => {
    setModalStatus({ type: 'add', isOpen: true });
  };

  const handleUpdateClick = () => {
    const updatingPlayerData = data[tableProps.selectedRow];

    setModalStatus({ isOpen: true, type: 'update' });
    setEditingUser(updatingPlayerData);
  };

  // todo: fix
  const handleDeleteClick = async () => { };

  // todo: add notifications
  const onSubmit = async (newPlayer: PlayerT) => {
    const normalizedNewPlayer = {
      ...newPlayer,
      age: parseInt(newPlayer.age),
      level: parseInt(newPlayer.level),
      is_coach: newPlayer.is_coach || false,
      // todo: handle image
      avatar: null,
    };

    if (modalStatus.type === 'add') {
      const { isOk, data, errorMessage } = await createPlayer(normalizedNewPlayer)

      if (isOk) {
        handleReset();

        //todo: fix type
        setData(v => v.concat([data]));
      } else {
        console.warn(errorMessage);
      }
    }

    if (modalStatus.type === 'update') {
      const { isOk, data, errorMessage } = await updatePlayer(normalizedNewPlayer);
      if (isOk) {
        handleReset();

        // todo: prevent duplication when updating same node
        // to reproduce: update same multiple times and doplicated rows appear 
        setData(v => v.concat([data]));
      } else {
        console.warn(errorMessage);
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
      <TableControls
        selectedRow={tableProps.selectedRow}
        handleAddClick={handleAddClick}
        handleUpdateClick={handleUpdateClick}
        handleDeleteClick={handleDeleteClick}
        handleResetClick={handleReset}
      />
      {data.length > 0 ? (
          <Table {...tableProps} />
      ) : null}
      <Pagination pagination={pagination} setPagination={setPagination} />
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
