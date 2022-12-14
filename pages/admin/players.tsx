import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';
import { useForm, Controller } from 'react-hook-form';
import { format } from 'date-fns';

import TableControls from 'components/admin/TableControls';
import Table, { useTable } from 'components/admin/Table';
import Pagination from 'components/admin/Pagination';
import PageTitle from 'ui-kit/PageTitle';
import Modal from 'ui-kit/Modal';
import InputWithError from 'ui-kit/InputWithError';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import {
  DEFAULT_MODAL,
  LEVEL_NUMBER_VALUES,
  PLAYER_COLUMNS,
} from 'constants/values';
import {
  createPlayer,
  updatePlayer,
  deleteSelectedPlayer,
} from 'services/players';

import formStyles from './Form.module.scss';
import usePlayers from 'hooks/usePlayers';

const Players: NextPage = () => {
  const { players, isLoading, mutate } = usePlayers();
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);
  const [editingPlayer, setEditingPlayer] = useState<PlayerT>();
  const { pagination, setPagination, ...tableProps } = useTable(
    players,
    PLAYER_COLUMNS
  );

  const handleReset = () => {
    tableProps.setSelectedRow(-1);
    setEditingPlayer(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const handleAddClick = () => {
    setModalStatus({ isOpen: true, type: 'add' });
  };

  const handleUpdateClick = () => {
    const editingPlayerData = players[tableProps.selectedRow];

    setModalStatus({ isOpen: true, type: 'update' });
    setEditingPlayer(editingPlayerData);
  };

  const handleDeleteClick = async () => {
    const { id } = players[tableProps.selectedRow];
    const res = await deleteSelectedPlayer(id);

    if (res.isOk) {
      mutate();
      handleReset();
    }
  };

  const onSubmit = async (newPlayer: PlayerT) => {
    if (modalStatus.type === 'add') {
      const { isOk, data, errorMessage } = await createPlayer(newPlayer);

      if (isOk) {
        handleReset();

        mutate();
      } else {
        console.warn(errorMessage);
      }
    }

    if (modalStatus.type === 'update') {
      // todo: swr
      const { isOk, errorMessage } = await updatePlayer(newPlayer);
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
        <PageTitle>???????????????????? ????????????????</PageTitle>
      </div>
      <TableControls
        selectedRow={tableProps.selectedRow}
        handleAddClick={handleAddClick}
        handleUpdateClick={handleUpdateClick}
        handleDeleteClick={handleDeleteClick}
        handleResetClick={handleReset}
      />
      {isLoading ? <LoadingSpinner /> : <Table {...tableProps} />}
      <Pagination pagination={pagination} setPagination={setPagination} />
      {modalStatus.isOpen ? (
        <Modal handleClose={handleReset} title="?????????????????????????? ??????????????">
          <PlayerForm player={editingPlayer} onSubmit={onSubmit} />
        </Modal>
      ) : null}
    </div>
  );
};

const PlayerForm = ({
  player,
  onSubmit,
}: {
  player?: PlayerT;
  onSubmit: (v: PlayerT) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<any>({
    defaultValues: {
      level: null,
      age: null,
      is_coach: false,
      technique: null,
      tactics: null,
      power: null,
      shakes: null,
      serve: null,
      behaviour: null,
      height: null,
      ...player,
      in_tennis_from: player?.in_tennis_from
        ? format(new Date(player?.in_tennis_from), 'yyyy-MM-dd')
        : null,
      date_of_birth: player?.date_of_birth
        ? format(new Date(player?.date_of_birth), 'yyyy-MM-dd')
        : null,
    },
  });

  return (
    <div className={formStyles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWithError errorMessage={errors.avatar?.message}>
          <input
            placeholder="???????????? ???? ????????"
            {...register('avatar', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.first_name?.message}>
          <input
            placeholder="??????"
            {...register('first_name', { required: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.last_name?.message}>
          <input
            placeholder="??????????????"
            {...register('last_name', { required: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.date_of_birth?.message}>
          <br />
          ???????? ????????????????:
          <input
            type="date"
            {...register('date_of_birth', {
              required: false,
              valueAsDate: true,
            })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.city?.message}>
          <input
            placeholder="??????????"
            {...register('city', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.country?.message}>
          <input
            placeholder="????????????"
            {...register('country', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.phone?.message}>
          <input
            placeholder="?????????? ????????????????"
            {...register('phone', {
              pattern: {
                value: /^375\d{9}$/,
                message: 'correct format: 375291234567',
              },
            })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.email?.message}>
          <input
            placeholder="E-mail"
            {...register('email', {
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'correct format: emailname@address.com',
              },
            })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.level?.message}>
          ??????????????
          <select
            {...register('level', { required: true, valueAsNumber: true })}
          >
            {Object.entries(LEVEL_NUMBER_VALUES).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </InputWithError>
        <InputWithError errorMessage={errors.gameplay_style?.message}>
          <input
            placeholder="?????????? ????????"
            {...register('gameplay_style', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.forehand?.message}>
          <input
            placeholder="??????????????"
            {...register('forehand', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.height?.message}>
          <input
            placeholder="????????"
            {...register('height', { required: false, valueAsNumber: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.beckhand?.message}>
          <input
            placeholder="??????????????"
            {...register('beckhand', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.job_description?.message}>
          <input
            placeholder="?????? ????????????????????????"
            {...register('job_description', { required: false })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.in_tennis_from?.message}>
          <br />
          ?????????? ?????????? ????????????:
          <input
            type="date"
            {...register('in_tennis_from', {
              required: false,
              valueAsDate: true,
            })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.insta_link?.message}>
          <input
            placeholder="???????????? ???? ??????????"
            {...register('insta_link', {
              pattern: {
                value: /(?:(?:https):\/\/)?(?:www.)?(?:instagram.com)\//,
                message:
                  'correct format: https://www.instagram.com/it.familyy/',
              },
            })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.is_coach?.message}>
          <br />
          ???????????????? ????????????????:
          <Controller
            name="is_coach"
            control={control}
            rules={{ required: false }}
            render={({ field }) => (
              <input type="checkbox" {...field} checked={field.value} />
            )}
          />
        </InputWithError>
        {/* need to add columns to the db */}
        <h3>????????????????????????????</h3>
        <InputWithError errorMessage={errors.technique?.message}>
          <br />
          ??????????????:
          <input
            {...register('technique', { required: true, valueAsNumber: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.tactics?.message}>
          <br />
          ??????????????:
          <input
            {...register('tactics', { required: true, valueAsNumber: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.power?.message}>
          <br />
          ????????:
          <input
            {...register('power', { required: true, valueAsNumber: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.shakes?.message}>
          <br />
          ??????:
          <input
            {...register('shakes', { required: true, valueAsNumber: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.serve?.message}>
          <br />
          ????????????:
          <input
            {...register('serve', { required: true, valueAsNumber: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.behaviour?.message}>
          <br />
          ??????????????????:
          <input
            {...register('behaviour', { required: true, valueAsNumber: true })}
          />
        </InputWithError>
        <div className={formStyles.formActions}>
          <input className={formStyles.submitButton} type="submit" />
        </div>
      </form>
    </div>
  );
};

export default Players;
