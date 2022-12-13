import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';

import TableControls from 'components/admin/TableControls';
import Table, { useTable } from 'components/admin/Table';
import DataForm from 'components/admin/DataForm';
import Pagination from 'components/admin/Pagination';
import PageTitle from 'ui-kit/PageTitle';
import { DEFAULT_MODAL } from 'constants/values';
import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deleteSelectedPlayer,
} from 'services/players';

const FORM_TITLES: { [k: string]: string } = {
  add: 'Добавить игрока',
  update: 'Изменить игрока',
};

const Players: NextPage = () => {
  const [data, setData] = useState<PlayerT[]>([]);
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);
  const [editingPlayer, setEditingPlayer] = useState<undefined | PlayerT>();
  const { pagination, setPagination, ...tableProps } = useTable(
    'players',
    data
  );

  useEffect(() => {
    const fetchWrapper = async () => {
      const res = await getPlayers(pagination);

      if (res.isOk) {
        setData(res.data as PlayerT[]);
      }
    };

    fetchWrapper();
  }, [pagination]);

  const handleReset = () => {
    tableProps.setSelectedRow(-1);
    setEditingPlayer(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const handleAddClick = () => {
    setModalStatus({ isOpen: true, type: 'add' });
  };

  const handleUpdateClick = () => {
    const updatingPlayerData = data[tableProps.selectedRow];

    setModalStatus({ isOpen: true, type: 'update' });
    setEditingPlayer(updatingPlayerData);
  };

  const handleDeleteClick = async () => {
    const { id } = data[tableProps.selectedRow];

    // todo: add delete operation
    // deleteSelectedPlayer(id);
  };

  // todo: add notifications
  const onSubmit = async (newPlayer: PlayerT) => {
    const normalizedNewPlayer = {
      ...editingPlayer,
      ...newPlayer,
      age: parseInt(newPlayer.age as any as string),
      level: parseInt(newPlayer.level as any as string),
      is_coach: newPlayer.is_coach || false,
      in_tennis_from: new Date(newPlayer.in_tennis_from as any),
      date_of_birth: new Date(newPlayer.date_of_birth as any),
      avatar: newPlayer.avatar || null,
    };

    if (modalStatus.type === 'add') {
      const { isOk, data, errorMessage } = await createPlayer(
        normalizedNewPlayer
      );

      if (isOk) {
        handleReset();

        setData((prevV) => prevV.map((v) => (v.id === data?.id ? data : v)));
      } else {
        console.warn(errorMessage);
      }
    }

    if (modalStatus.type === 'update') {
      const { isOk, data, errorMessage } = await updatePlayer(
        normalizedNewPlayer
      );
      if (isOk) {
        handleReset();

        setData((prevV) => prevV.map((v) => (v.id === data?.id ? data : v)));
      } else {
        console.warn(errorMessage);
      }
    }
  };

  return (
    <div>
      <div>
        <PageTitle>Управление игроками</PageTitle>
      </div>
      <TableControls
        selectedRow={tableProps.selectedRow}
        handleAddClick={handleAddClick}
        handleUpdateClick={handleUpdateClick}
        handleDeleteClick={handleDeleteClick}
        handleResetClick={handleReset}
      />
      {data.length > 0 ? <Table {...tableProps} /> : null}
      <Pagination pagination={pagination} setPagination={setPagination} />
      {modalStatus.isOpen ? (
        <DataForm
          type="players"
          formTitle={FORM_TITLES[modalStatus.type]}
          onSubmit={onSubmit}
          onClose={handleReset}
          editingRow={editingPlayer}
        />
      ) : null}
    </div>
  );
};

export default Players;
