import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { tournament as TournamentT } from '@prisma/client';

import TableControls from 'components/admin/TableControls';
import Table, { useTable } from 'components/admin/Table';
import Pagination from 'components/admin/Pagination';
import DataForm from 'components/admin/DataForm';
import PageTitle from 'ui-kit/PageTitle';
import { DEFAULT_MODAL } from 'constants/values';
import {
  getTournaments,
  createTournament,
  updateTournament,
  deleteSelectedTournament,
} from 'services/tournaments';

const FORM_TITLES: { [k: string]: string } = {
  add: 'Добавить турнир',
  update: 'Изменить турнир',
};

const Tournaments: NextPage = () => {
  const router = useRouter();
  const [data, setData] = useState<TournamentT[]>([]);
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);
  const [editingTournament, setEditingTournament] = useState<
    undefined | TournamentT
  >();
  const { pagination, setPagination, ...tableProps } = useTable(
    'tournaments',
    data
  );

  useEffect(() => {
    const fetchWrapper = async () => {
      const res = await getTournaments(pagination);

      if (res.isOk) {
        setData(res.data as TournamentT[]);
      }
    };

    fetchWrapper();
  }, [pagination]);

  const handleReset = () => {
    tableProps.setSelectedRow(-1);
    setEditingTournament(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const handleAddClick = () => {
    setModalStatus({ isOpen: true, type: 'add' });
  };

  const handleUpdateClick = () => {
    const updatingTournamentData = data[tableProps.selectedRow];

    setModalStatus({ isOpen: true, type: 'update' });
    setEditingTournament(updatingTournamentData);
  };

  const handleDeleteClick = async () => {
    const { id } = data[tableProps.selectedRow];

    // todo: add delete operation
    // deleteSelectedPlayer(id);
  };

  const handlePickClick = () => {
    const { id } = data[tableProps.selectedRow];
    const href = '/admin/tournaments/' + id;
    router.push(href);
  };

  // todo: add notifications
  const onSubmit = async (newTournament: TournamentT) => {
    const normalizedNewTournament = {
      ...newTournament,
      is_doubles: newTournament.is_doubles || false,
      tournament_type: parseInt(newTournament.tournament_type as any as string),
      surface: parseInt(newTournament.surface as any as string),
      status: parseInt(newTournament.status as any as string),
      start_date: new Date(newTournament.start_date as any),
    };

    if (modalStatus.type === 'add') {
      const { isOk, data, errorMessage } = await createTournament(
        normalizedNewTournament
      );

      if (isOk) {
        handleReset();

        setData((v) => [data as TournamentT].concat(v));
      } else {
        console.warn(errorMessage);
      }
    }

    if (modalStatus.type === 'update') {
      const { isOk, data, errorMessage } = await updateTournament(
        newTournament
      );
      if (isOk) {
        handleReset();

        setData((v) => v.concat([data as TournamentT]));
      } else {
        console.warn(errorMessage);
      }
    }
  };

  return (
    <div>
      <div>
        <PageTitle>Управление турнирами</PageTitle>
      </div>
      <TableControls
        selectedRow={tableProps.selectedRow}
        handlePickClick={handlePickClick}
        handleAddClick={handleAddClick}
        handleUpdateClick={handleUpdateClick}
        handleDeleteClick={handleDeleteClick}
        handleResetClick={handleReset}
      />
      {data.length > 0 ? <Table {...tableProps} /> : null}
      <Pagination pagination={pagination} setPagination={setPagination} />
      {modalStatus.isOpen ? (
        <DataForm
          type="tournaments"
          formTitle={FORM_TITLES[modalStatus.type]}
          onSubmit={onSubmit}
          onClose={handleReset}
          editingRow={editingTournament}
        />
      ) : null}
    </div>
  );
};

export default Tournaments;
