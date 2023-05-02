import {
  Dispatch,
  SetStateAction,
  useCallback,
  useState,
  useMemo,
} from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT, player_elo_ranking } from '@prisma/client';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import TableControls from 'components/admin/TableControls';
import PageTitle from 'ui-kit/PageTitle';
import Modal from 'ui-kit/Modal';
import InputWithError from 'ui-kit/InputWithError';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import LoadingShadow from 'components/LoadingShadow';
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
import usePlayers from 'hooks/usePlayers';
import useEloPoints from 'hooks/useEloPoints';

import tableStyles from './Table.module.scss';
import formStyles from '../../styles/Form.module.scss';

const Players: NextPage = () => {
  const [isLoadingState, setIsLoadingState] = useState(false);
  const { players, isLoading, mutate } = usePlayers();
  const { eloPoints, mutate: mutateElo } = useEloPoints();
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);
  const [editingPlayer, setEditingPlayer] = useState<PlayerT>();
  const [selectedRow, setSelectedRow] = useState(-1);

  const handleReset = () => {
    setSelectedRow(-1);
    setEditingPlayer(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const handleAddClick = useCallback(() => {
    setModalStatus({ isOpen: true, type: 'add' });
  }, []);

  const handleUpdateClick = useCallback(() => {
    const editingPlayerData = players[selectedRow];

    setModalStatus({ isOpen: true, type: 'update' });
    setEditingPlayer(editingPlayerData);
  }, [players, selectedRow]);

  const handleDeleteClick = useCallback(async () => {
    setIsLoadingState(true);
    const { id } = players[selectedRow];
    const res = await deleteSelectedPlayer(id);

    if (res.isOk) {
      await mutate();
      handleReset();
    }
    setIsLoadingState(false);
  }, [players, selectedRow, mutate]);

  const onSubmit = useCallback(
    async (props: PlayerT & { elo_points: number | null }) => {
      setIsLoadingState(true);
      let res;
      if (modalStatus.type === 'add') {
        res = await createPlayer(props);

        await mutateElo();
      }

      if (modalStatus.type === 'update') {
        const { elo_points, ...propsToUpdate } = props;
        res = await updatePlayer(propsToUpdate);
      }

      if (res?.isOk) {
        handleReset();

        await mutate();
      } else {
        console.error(res?.errorMessage);
      }
      setIsLoadingState(false);
    },
    [modalStatus, mutate, mutateElo]
  );

  return (
    <>
      {(isLoading || isLoadingState) && <LoadingShadow />}
      <div className={tableStyles.tableHeaderWrapper}>
        <div className={tableStyles.tableHeader}>
          <PageTitle>Управление игроками</PageTitle>
          <TableControls
            isLoading={isLoading}
            selectedRow={selectedRow}
            handleAddClick={handleAddClick}
            handleUpdateClick={handleUpdateClick}
            handleDeleteClick={handleDeleteClick}
            handleResetClick={handleReset}
          />
        </div>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <PlayersTable
          eloPoints={eloPoints}
          players={players}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
      {modalStatus.isOpen ? (
        <Modal handleClose={handleReset} title="Редактировать игроока">
          <PlayerForm player={editingPlayer} onSubmit={onSubmit} />
        </Modal>
      ) : null}
    </>
  );
};

const PlayerForm = ({
  player,
  onSubmit,
}: {
  player?: PlayerT;
  onSubmit: (v: PlayerT & { elo_points: number | null }) => Promise<void>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PlayerT & { elo_points: number | null }>({
    defaultValues: {
      level: null,
      age: null,
      technique: 0,
      power: 0,
      net_game: 0,
      serve: 0,
      behavior: 0,
      height: null,
      elo_points: null,
      premium: player?.premium || false,
      isHyped: player?.isHyped || false,
      ...player,
      in_tennis_from: player?.in_tennis_from
        ? (format(new Date(player?.in_tennis_from), 'yyyy-MM-dd') as any)
        : null,
      date_of_birth: player?.date_of_birth
        ? (format(new Date(player?.date_of_birth), 'yyyy-MM-dd') as any)
        : null,
    },
  });

  return (
    <div className={formStyles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWithError error={errors.avatar}>
          Ссылка на авку
          <br />
          <input {...register('avatar', { required: false })} />
        </InputWithError>
        <InputWithError error={errors.first_name}>
          Имя
          <br />
          <input {...register('first_name', { required: true })} />
        </InputWithError>
        <InputWithError error={errors.last_name}>
          Фамилия
          <br />
          <input {...register('last_name', { required: true })} />
        </InputWithError>
        <InputWithError error={errors.date_of_birth}>
          Дата рождения
          <br />
          <input
            type="date"
            {...register('date_of_birth', {
              required: false,
              valueAsDate: true,
            })}
          />
        </InputWithError>
        <InputWithError error={errors.city}>
          Город
          <br />
          <input {...register('city', { required: false })} />
        </InputWithError>
        <InputWithError error={errors.country}>
          Страна
          <br />
          <input {...register('country', { required: false })} />
        </InputWithError>
        <InputWithError error={errors.phone}>
          Номер телефона
          <br />
          <input
            {...register('phone', {
              pattern: {
                value: /^375\d{9}$/,
                message: 'correct format: 375291234567',
              },
            })}
          />
        </InputWithError>
        <InputWithError error={errors.email}>
          E-mail
          <br />
          <input
            {...register('email', {
              pattern: {
                value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                message: 'correct format: emailname@address.com',
              },
            })}
          />
        </InputWithError>
        <InputWithError error={errors.level}>
          Уровень
          <br />
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
        <InputWithError error={errors.gameplay_style}>
          Стиль игры
          <br />
          <input {...register('gameplay_style', { required: false })} />
        </InputWithError>
        <InputWithError error={errors.forehand}>
          Форхэнд
          <br />
          <input {...register('forehand', { required: false })} />
        </InputWithError>
        <InputWithError error={errors.height}>
          Рост
          <br />
          <input
            {...register('height', { required: false, valueAsNumber: true })}
          />
        </InputWithError>
        <InputWithError error={errors.backhand}>
          Бэкхэнд
          <br />
          <input {...register('backhand', { required: false })} />
        </InputWithError>
        <InputWithError error={errors.job_description}>
          Род деятельности
          <br />
          <input {...register('job_description', { required: false })} />
        </InputWithError>
        <InputWithError error={errors.in_tennis_from}>
          Когда начал играть
          <br />
          <input
            type="date"
            {...register('in_tennis_from', {
              required: false,
              valueAsDate: true,
            })}
          />
        </InputWithError>
        <InputWithError error={errors.insta_link}>
          Ссылка на инсту
          <br />
          <input
            {...register('insta_link', {
              pattern: {
                value: /(?:(?:https):\/\/)?(?:www.)?(?:instagram.com)\//,
                message:
                  'correct format: https://www.instagram.com/it.familyy/',
              },
            })}
          />
        </InputWithError>
        {!player && (
          <InputWithError error={errors.elo_points}>
            очки, которые задаются при создании игрока один раз
            <br />
            в дальнейшие изменения происходят автоматически или через базу
            данных
            <input
              type="number"
              placeholder="Очки эло"
              {...register('elo_points', {
                required: true,
                valueAsNumber: true,
              })}
            />
          </InputWithError>
        )}
        <br />
        <InputWithError error={errors.premium}>
          Премиум (из Аллеи славы)
          <br />
          <input type="checkbox" {...register('premium')} />
        </InputWithError>
        <InputWithError error={errors.isHyped}>
          <p style={{ textAlign: 'center', margin: '0' }}>На хайпе</p>
          <input type="checkbox" {...register('isHyped')} />
        </InputWithError>
        <br />
        <h3>Характеристики</h3>
        <InputWithError error={errors.technique}>
          Техника
          <br />
          <input
            {...register('technique', {
              required: true,
              valueAsNumber: true,
              max: 100,
              min: 0,
            })}
          />
        </InputWithError>
        <InputWithError error={errors.psychology}>
          Психология
          <br />
          <input
            {...register('psychology', {
              required: true,
              valueAsNumber: true,
              max: 100,
              min: 0,
            })}
          />
        </InputWithError>
        <InputWithError error={errors.power}>
          Мощь
          <br />
          <input
            {...register('power', {
              required: true,
              valueAsNumber: true,
              max: 100,
              min: 0,
            })}
          />
        </InputWithError>
        <InputWithError error={errors.net_game}>
          Игра на сетке
          <br />
          <input
            {...register('net_game', {
              required: true,
              valueAsNumber: true,
              max: 100,
              min: 0,
            })}
          />
        </InputWithError>
        <InputWithError error={errors.serve}>
          Подача
          <br />
          <input
            {...register('serve', {
              required: true,
              valueAsNumber: true,
              max: 100,
              min: 0,
            })}
          />
        </InputWithError>
        <InputWithError error={errors.behavior}>
          Поведение
          <br />
          <input
            {...register('behavior', {
              required: true,
              valueAsNumber: true,
              max: 100,
              min: 0,
            })}
          />
        </InputWithError>
        <div className={formStyles.formActions}>
          <input className={formStyles.submitButton} type="submit" />
        </div>
      </form>
    </div>
  );
};

const getTableValue = (
  p: PlayerT & { elo_points: number },
  k: keyof (PlayerT & { elo_points: number })
) => {
  if (k === 'date_of_birth' && p.date_of_birth) {
    return format(new Date(p.date_of_birth), 'dd.MM.yyyy');
  }

  if (k === 'in_tennis_from' && p.in_tennis_from) {
    return format(new Date(p.in_tennis_from), 'dd.MM.yyyy');
  }

  if (k === 'level' && p.level !== null) {
    return LEVEL_NUMBER_VALUES[p.level];
  }

  if (k === 'premium' && p.premium !== null) {
    return p.premium + '';
  }

  return p[k];
};

const PlayersTable = ({
  players,
  selectedRow,
  setSelectedRow,
  eloPoints,
}: {
  players: PlayerT[];
  selectedRow: number;
  setSelectedRow: Dispatch<SetStateAction<number>>;
  eloPoints: player_elo_ranking[];
}) => {
  const handleCheckboxClick = (i: number) => {
    setSelectedRow((v) => (v === i ? -1 : i));
  };

  const eloPointsMap = useMemo(
    () =>
      eloPoints.reduce((acc, p) => {
        acc.set(p.player_id as number, p?.elo_points);
        return acc;
      }, new Map<number, number | null>()),
    [eloPoints]
  );

  return (
    <div className={tableStyles.tableWrapper}>
      <table className={tableStyles.table}>
        <thead>
          <tr>
            <td />
            {PLAYER_COLUMNS.map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((p, i) => (
            <tr
              key={p.id}
              className={selectedRow === i ? tableStyles.selectedRow : ''}
            >
              <td key="checkbox">
                <input
                  checked={selectedRow === i}
                  onChange={() => handleCheckboxClick(i)}
                  type="checkbox"
                />
              </td>
              {PLAYER_COLUMNS.map((cellKey) => (
                <td key={cellKey}>
                  {
                    getTableValue(
                      { ...p, elo_points: eloPointsMap.get(p.id) as number },
                      cellKey
                    ) as any
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Players;
