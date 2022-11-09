import { useEffect, useState } from 'react';
import type { NextPage } from 'next';

import type { tournament as TournamentT } from '@prisma/client';

import TableControls from '../../components/admin/TableControls';
import Table, { useTable } from '../../components/admin/Table';
import Pagination from '../../components/admin/Pagination';
import DataForm from '../../components/admin/DataForm';
import { DEFAULT_MODAL } from '../../constants/values';
import {
  getTournaments,
  createTournament,
  updateTournament,
} from '../../services/tournaments';
import PageTitle from '../../ui-kit/PageTitle';

const Tournaments: NextPage<{ tournaments: TournamentT[] }> = ({ tournaments = [] }) => {
  const [data, setData] = useState(tournaments)
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL)
  const [editingTournament, setEditingTournament] = useState<undefined | TournamentT>()
  const { pagination, setPagination, ...tableProps } = useTable('tournaments', data);

  useEffect(() => {
    const fetchWrapper = async () => {
      const res = await getTournaments(pagination);

      if (res.isOk) {
        setData(res.data as TournamentT[]);
      }
    };

    fetchWrapper();
  }, [pagination])

  const handleReset = () => {
    tableProps.setSelectedRow(-1);
    setEditingTournament(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const handleAddClick = () => {
    setModalStatus({ type: 'add', isOpen: true });
  };

  const handleUpdateClick = () => {
    const updatingPlayerData = data[tableProps.selectedRow];

    setModalStatus({ isOpen: true, type: 'update' });
    setEditingTournament(editingTournament);
  };

  // todo: fix
  const handleDeleteClick = async () => { };

  // todo: add notifications
  const onSubmit = async (newTournament: TournamentT) => {
    if (modalStatus.type === 'add') {
      const { isOk, data, errorMessage } = await createTournament({ ...newTournament, date_of_birth: null })

      if (isOk) {
        handleReset();

        //todo: fix type
        setData(v => v.concat([data]));
      } else {
        console.warn(errorMessage);
      }
    }

    if (modalStatus.type === 'update') {
      const { isOk, data, errorMessage } = await updateTournament(newTournament);
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
          Управление турнирами
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
          editingRow={editingTournament}
          type="tournaments"
        />
        : null}
    </div>
  )
}

export default Tournaments
