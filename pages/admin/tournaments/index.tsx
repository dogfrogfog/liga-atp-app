import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { tournament as TournamentT } from '@prisma/client';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

import TableControls from 'components/admin/TableControls';
import Table, { useTable } from 'components/admin/Table';
import Pagination from 'components/admin/Pagination';
import {
  DEFAULT_MODAL,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  SURFACE_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
  TOURNAMENT_COLUMNS,
} from 'constants/values';
import PageTitle from 'ui-kit/PageTitle';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import InputWithError from 'ui-kit/InputWithError';
import Modal from 'ui-kit/Modal';
import useTournaments from 'hooks/useTournaments';

import {
  createTournament,
  updateTournament,
  deleteSelectedTournament,
} from 'services/tournaments';

import formStyles from '../Form.module.scss';

const Tournaments: NextPage = () => {
  const router = useRouter();

  // should be paginated?
  const { tournaments, isLoading, mutate } = useTournaments();

  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);
  const [editingTournament, setEditingTournament] = useState<
    undefined | TournamentT
  >();
  const { pagination, setPagination, ...tableProps } = useTable(
    tournaments,
    TOURNAMENT_COLUMNS
  );

  const handleReset = () => {
    tableProps.setSelectedRow(-1);
    setEditingTournament(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const handleAddClick = () => {
    setModalStatus({ isOpen: true, type: 'add' });
  };

  const handleUpdateClick = () => {
    const updatingTournamentData = tournaments[tableProps.selectedRow];

    setModalStatus({ isOpen: true, type: 'update' });
    setEditingTournament(updatingTournamentData);
  };

  const handleDeleteClick = async () => {
    const { id } = tournaments[tableProps.selectedRow];

    // todo: add delete operation
    // deleteSelectedPlayer(id);
  };

  const handlePickClick = () => {
    const { id } = tournaments[tableProps.selectedRow];
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
      const { isOk, errorMessage } = await createTournament(
        normalizedNewTournament
      );

      if (isOk) {
        handleReset();

        mutate();
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

        mutate();
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
      {isLoading ? <LoadingSpinner /> : <Table {...tableProps} />}
      <Pagination pagination={pagination} setPagination={setPagination} />
      {modalStatus.isOpen ? (
        <Modal handleClose={handleReset} title="Редактировать турнир">
          <TournamentForm tournament={editingTournament} onSubmit={onSubmit} />
        </Modal>
      ) : null}
    </div>
  );
};

const TournamentForm = ({
  tournament,
  onSubmit,
}: {
  tournament?: TournamentT;
  onSubmit: (v: TournamentT) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<any>({
    defaultValues: {
      tournament_type: null,
      surface: null,
      status: 1,
      is_doubles: false,
      ...tournament,
      start_date: tournament?.start_date
        ? format(new Date(tournament?.start_date), 'yyyy-MM-dd')
        : null,
    },
  });

  return (
    <div className={formStyles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWithError errorMessage={errors.name?.message}>
          <input
            placeholder="Название турнира"
            {...register('name', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.address?.message}>
          <input
            placeholder="Адрес"
            {...register('address', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.city?.message}>
          <input
            placeholder="Город"
            {...register('city', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.tournament_type?.message}>
          <br />
          Тип турнира:
          <select
            {...register('tournament_type', {
              required: true,
              valueAsNumber: true,
            })}
          >
            {Object.entries(TOURNAMENT_TYPE_NUMBER_VALUES).map(
              ([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              )
            )}
          </select>
        </InputWithError>
        <InputWithError errorMessage={errors.surface?.message}>
          <br />
          Поверхность:
          <select
            {...register('surface', { required: true, valueAsNumber: true })}
          >
            {Object.entries(SURFACE_TYPE_NUMBER_VALUES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </InputWithError>
        <InputWithError errorMessage={errors.status?.message}>
          <br />
          Статус:
          <select
            {...register('status', { required: true, valueAsNumber: true })}
          >
            {Object.entries(TOURNAMENT_STATUS_NUMBER_VALUES).map(
              ([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              )
            )}
          </select>
        </InputWithError>
        <InputWithError errorMessage={errors.start_date?.message}>
          <input
            placeholder="Начало турнира"
            type="date"
            {...register('start_date', { required: false, valueAsDate: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.is_doubles?.message}>
          <br />
          Парный разряд:
          <Controller
            name="is_doubles"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <input type="checkbox" {...field} checked={field.value} />
            )}
          />
        </InputWithError>
        <div className={formStyles.formActions}>
          <input className={formStyles.submitButton} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Tournaments;
