import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { tournament as TournamentT } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import TableControls from 'components/admin/TableControls';
import {
  DEFAULT_MODAL,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  SURFACE_TYPE_NUMBER_VALUES,
  TOURNAMENT_DRAW_TYPE_NUMBER_VALUES,
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

import tableStyles from '../Table.module.scss';
import formStyles from '../../../styles/Form.module.scss';

const Tournaments: NextPage = () => {
  const router = useRouter();
  const { tournaments, isLoading, mutate } = useTournaments();

  const [selectedRow, setSelectedRow] = useState(-1);
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);
  const [editingTournament, setEditingTournament] = useState<
    undefined | TournamentT
  >();

  const handleReset = () => {
    setSelectedRow(-1);
    setEditingTournament(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const handleAddClick = useCallback(() => {
    setModalStatus({ isOpen: true, type: 'add' });
  }, []);

  const handleUpdateClick = useCallback(() => {
    const updatingTournamentData = tournaments[selectedRow];

    setModalStatus({ isOpen: true, type: 'update' });
    setEditingTournament(updatingTournamentData);
  }, [tournaments, selectedRow]);

  const handleDeleteClick = useCallback(async () => {
    const { id } = tournaments[selectedRow];

    const { isOk } = await deleteSelectedTournament(id);

    if (isOk) {
      handleReset();

      mutate();
    }
  }, [tournaments, selectedRow, mutate]);

  const handlePickClick = useCallback(() => {
    const { id } = tournaments[selectedRow];
    const href = '/admin/tournaments/' + id;
    router.push(href);
  }, [selectedRow, tournaments, router]);

  const onSubmit = async (newTournament: TournamentT) => {
    const normalizedNewTournament = {
      ...newTournament,
      tournament_type: parseInt(newTournament.tournament_type as any as string),
      surface: parseInt(newTournament.surface as any as string),
      status: parseInt(newTournament.status as any as string),
      start_date: new Date(newTournament.start_date as any),
    };

    let res;
    if (modalStatus.type === 'add') {
      res = await createTournament(normalizedNewTournament);
    }

    if (modalStatus.type === 'update') {
      res = await updateTournament(newTournament);
    }

    if (res?.isOk) {
      handleReset();

      mutate();
    } else {
      console.error(res?.errorMessage);
    }
  };

  return (
    <div>
      <PageTitle>Управление турнирами</PageTitle>
      <TableControls
        isLoading={isLoading}
        selectedRow={selectedRow}
        handlePickClick={handlePickClick}
        handleAddClick={handleAddClick}
        handleUpdateClick={handleUpdateClick}
        handleDeleteClick={handleDeleteClick}
        handleResetClick={handleReset}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <TournamentsTable
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          tournaments={tournaments}
        />
      )}
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
  } = useForm<TournamentT>({
    defaultValues: {
      tournament_type: null,
      surface: null,
      status: 1,
      ...tournament,
      start_date: tournament?.start_date
        ? (format(new Date(tournament?.start_date), 'yyyy-MM-dd') as any)
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
        <div className={formStyles.formActions}>
          <input className={formStyles.submitButton} type="submit" />
        </div>
      </form>
    </div>
  );
};

const getTableValue = (t: TournamentT, k: keyof TournamentT) => {
  if (k === 'draw_type' && t.draw_type) {
    return TOURNAMENT_DRAW_TYPE_NUMBER_VALUES[t.draw_type];
  }

  if (k === 'surface' && t.surface) {
    return SURFACE_TYPE_NUMBER_VALUES[t.surface];
  }

  if (k === 'status' && t.status) {
    return TOURNAMENT_STATUS_NUMBER_VALUES[t.status];
  }

  if (k === 'start_date' && t.start_date) {
    return format(new Date(t.start_date), 'dd.MM.yyyy');
  }

  if (k === 'tournament_type' && t.tournament_type) {
    return TOURNAMENT_TYPE_NUMBER_VALUES[t.tournament_type];
  }

  return t[k];
};

const TournamentsTable = ({
  tournaments,
  selectedRow,
  setSelectedRow,
}: {
  tournaments: TournamentT[];
  selectedRow: number;
  setSelectedRow: Dispatch<SetStateAction<number>>;
}) => {
  const handleCheckboxClick = (i: number) => {
    setSelectedRow((v) => (v === i ? -1 : i));
  };

  return (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <td />
            {TOURNAMENT_COLUMNS.map((field) => (
              // todo: add i18
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tournaments.map((t, i) => (
            <tr
              key={t.id}
              className={selectedRow === i ? tableStyles.selectedRow : ''}
            >
              <td key="checkbox">
                <input
                  checked={selectedRow === i}
                  onChange={() => handleCheckboxClick(i)}
                  type="checkbox"
                />
              </td>
              {TOURNAMENT_COLUMNS.map((cellKey) => (
                <td key={cellKey}>{getTableValue(t, cellKey) as any}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Tournaments;
