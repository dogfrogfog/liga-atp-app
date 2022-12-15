import { useState } from 'react';
import type { NextPage } from 'next';
import cl from 'classnames';
import {
  PrismaClient,
  tournament as TournamentT,
  player as PlayerT,
  match as MatchT,
} from '@prisma/client';
import { MultiSelect, Option } from 'react-multi-select-component';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

import {
  TOURNAMENT_DRAW_TYPE_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
  // DOUBLES_TOURNAMENT_DRAW,
  SURFACE_TYPE_NUMBER_VALUES,
  DEFAULT_MODAL,
} from 'constants/values';
import { DRAW_TYPE_NUMBER_VALUES } from 'constants/draw';
import PageTitle from 'ui-kit/PageTitle';
import Modal from 'ui-kit/Modal';
import InputWithError from 'ui-kit/InputWithError';
import { updateTournament } from 'services/tournaments';
import TournamentDraw, { IBracketsUnit } from 'components/admin/TournamentDraw';
import { createMatch, updateMatch } from 'services/matches';
import styles from './AdminSingleTournamentPape.module.scss';
import formStyles from '../Form.module.scss';

// todo: https://github.com/dogfrogfog/liga-atp-app/issues/49
const translation = {
  city: 'Город',
  address: 'Адрес',
  name: 'Название',
};

interface IAdminSingleTournamentPapeProps {
  tournament: TournamentT;
  players: PlayerT[];
  matches: MatchT[];
}

const getInitialBrackets = (drawType: number) => {
  const { totalStages, firstStageMatches, withQual, groups } =
    DRAW_TYPE_NUMBER_VALUES[drawType];
  let stageMatches = firstStageMatches;

  let result: MatchT[][];

  if (groups) {
    // fill first round with groups
    result = [new Array(groups).fill([])];

    for (let i = 1; i < totalStages; i += 1) {
      result.push(Array(stageMatches).fill({}));
      stageMatches = stageMatches / 2;
    }
  } else {
    result = withQual ? [Array(stageMatches).fill({})] : [];
    for (let i = 0; i < totalStages; i += 1) {
      result.push(Array(stageMatches).fill({}));
      stageMatches = stageMatches / 2;
    }
  }

  return result;
};

const playersToMultiSelectFormat = (players: PlayerT[]) =>
  players.reduce((acc, v) => {
    acc.push({ value: v.id, label: `${v.first_name} ${v.last_name}` });
    return acc;
  }, [] as Option[]);

const multiSelectFormatToPlayersIds = (options: Option[]) =>
  options.reduce((acc, { value }) => {
    acc.push(value);
    return acc;
  }, [] as number[]);

const AdminSingleTournamentPape: NextPage<IAdminSingleTournamentPapeProps> = ({
  tournament,
  players,
  matches: metchesOriginal,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  // when match already exists we save passed match to have default values to form
  // when match is not exists and we creating new match and updating tournament draw property ..
  // .. so we same stage index(si) and match index(mi)
  const [editingMatchData, setEditingMatchData] = useState<{
    newMatch?: MatchT;
    si?: number;
    mi?: number;
    isGroupMatch?: boolean;
  }>();

  const [matches, setMatches] = useState(metchesOriginal);
  const [activeTournament, setActiveTournament] = useState(tournament);
  const [newSelectedPlayers, setNewSelectedPlayers] = useState<Option[]>([]);
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);

  const handleReset = () => {
    setEditingMatchData(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const registeredPlayersIds = activeTournament.players_order
    ? JSON.parse(activeTournament?.players_order)?.players
    : [];
  const newSelectedPlayersIds =
    multiSelectFormatToPlayersIds(newSelectedPlayers);
  const brackets =
    activeTournament.draw &&
    (JSON.parse(activeTournament?.draw)?.brackets as IBracketsUnit[][]);

  // this regestered players array we use to get options for "edit match" players select inputs
  // also we use same data to get options for "draw unit" players select inputs (TournamentT)
  const registeredPlayers = players.filter(
    ({ id }) => registeredPlayersIds.indexOf(id) !== -1
  );

  const updateActiveTournament = async () => {
    setIsLoading(true);
    const newSelectedPlayersIds = newSelectedPlayers.reduce(
      (acc, v) => [...acc, v.value],
      [] as Option[]
    );

    const newTournament = await updateTournament({
      ...activeTournament,
      players_order: JSON.stringify({
        players: registeredPlayersIds.concat(newSelectedPlayersIds),
      }),
      draw: activeTournament.draw_type
        ? JSON.stringify({
            brackets:
              brackets || getInitialBrackets(activeTournament.draw_type),
          })
        : null,
      draw_type: parseInt(activeTournament.draw_type as any as string, 10),
      tournament_type: parseInt(
        activeTournament.tournament_type as any as string,
        10
      ),
    });

    if (newTournament.isOk) {
      // @ts-ignore
      const { match, ...v } = newTournament.data;

      setActiveTournament(v);
      setNewSelectedPlayers([]);
    }

    setIsLoading(false);
  };

  const handleTournamentFieldChange = (key: string, value: any) => {
    setActiveTournament((v) => ({ ...v, [key]: value }));
  };

  const onSubmit = async (match: MatchT) => {
    setIsLoading(true);
    if (
      editingMatchData?.si !== undefined &&
      editingMatchData?.mi !== undefined
    ) {
      const { player1_id, player2_id, player3_id, player4_id, winner_id, score } =
        match;
      const createdMatch = await createMatch({
        tournament_id: activeTournament.id,
        player1_id,
        player2_id,
        player3_id,
        player4_id,
        winner_id,
        is_completed: false,
        start_date: new Date(),
        score,
      } as MatchT);

      if (createdMatch.isOk) {
        const { data } = createdMatch;

        setMatches((v) => {
          v.push(data as MatchT);

          return v;
        });

        const newBrackets = (brackets as IBracketsUnit[][]).map((s, si) =>
          s.map((m, mi) => {
            const isTargetMatch =
              si === editingMatchData.si && mi === editingMatchData.mi;
            // to handle brackets with groups
            if (editingMatchData.isGroupMatch && isTargetMatch) {
              // @ts-ignore
              return [...m, { matchId: data?.id }];
            }

            if (isTargetMatch) {
              return { matchId: data?.id };
            }

            return m;
          })
        );

        const updatedTournament = await updateTournament({
          id: activeTournament.id,
          draw: JSON.stringify({
            brackets: newBrackets,
          }),
        } as TournamentT);

        if (updatedTournament.isOk) {
          // @ts-ignore
          const { match, ...v } = updatedTournament.data;

          setActiveTournament(v);
          setModalStatus(DEFAULT_MODAL);
        }
      }
    } else {
      const updatedMatch = await updateMatch(match);

      if (updatedMatch.isOk) {
        const { data } = updatedMatch;

        setMatches((prevV) => {
          // update existed array element
          // to prevent 2 versions of the same element (old + new one)
          return prevV.map((v) => (v.id === data?.id ? data : v));
        });
        setModalStatus(DEFAULT_MODAL);
      }
    }

    setIsLoading(false);
  };

  const openModalForNewMatch = (
    si: number,
    mi: number,
    isGroupMatch?: boolean
  ) => {
    setModalStatus({ isOpen: true, type: 'create' });
    setEditingMatchData({
      si,
      mi,
      isGroupMatch,
    });
  };

  const openModalForExistingMatch = (match: MatchT) => {
    setModalStatus({ isOpen: true, type: 'update' });
    setEditingMatchData({ newMatch: match });
  };

  const isDisabled =
    // OLD db records has is_finished prop...so we check it
    // (activeTournament.is_finished !== null && activeTournament.is_finished) ||
    // NEW db records has status prop...one of statuses is finished (equal to 3)....so we check it
    // (activeTournament.status === 3);
    false || isLoading;

  return (
    <div className={styles.container}>
      <PageTitle>Управление турниром</PageTitle>
      {isLoading && <div className={styles.isLoading}>идет сохранение ...</div>}
      <div className={styles.twoSides}>
        <div className={cl(styles.side, styles.fieldsContainer)}>
          {Object.entries(tournament).map(([key, value]) => {
            switch (key) {
              case 'draw_type': {
                return (
                  <div className={cl(styles.field, styles.drawType)} key={key}>
                    <span>Тип сетки в турнире</span>
                    <select
                      onChange={(e) => {
                        handleTournamentFieldChange(
                          'draw',
                          JSON.stringify({
                            brackets: getInitialBrackets(
                              parseInt(e.target.value, 10)
                            ),
                          })
                        );
                        handleTournamentFieldChange(
                          'draw_type',
                          e.target.value
                        );
                      }}
                      value={activeTournament.draw_type as number}
                      disabled={isDisabled}
                      name="drawType"
                    >
                      <option value={0}>not selected</option>
                      {Object.entries(TOURNAMENT_DRAW_TYPE_NUMBER_VALUES).map(
                        ([key, name]) => {
                          return (
                            <option key={key} value={key}>
                              {name as string}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>
                );
              }
              case 'tournament_type': {
                return (
                  <div className={cl(styles.field, styles.type)} key={key}>
                    <span>Тип турнира</span>
                    <select
                      onChange={(e) =>
                        handleTournamentFieldChange(
                          'tournament_type',
                          parseInt(e.target.value, 10)
                        )
                      }
                      value={activeTournament.tournament_type as number}
                      disabled={isDisabled}
                      name="type"
                    >
                      <option value={0}>not selected</option>
                      {Object.entries(TOURNAMENT_TYPE_NUMBER_VALUES).map(
                        ([key, name]) => {
                          return (
                            <option key={key} value={key}>
                              {name as string}
                            </option>
                          );
                        }
                      )}
                    </select>
                  </div>
                );
              }
              case 'status': {
                return (
                  <div key={key} className={cl(styles.field, styles.status)}>
                    <span>Статус</span>
                    <select
                      onChange={(e) =>
                        handleTournamentFieldChange(
                          'status',
                          parseInt(e.target.value, 10)
                        )
                      }
                      value={activeTournament.status as number}
                      disabled={isDisabled}
                      name="type"
                    >
                      <option value={1}>
                        {TOURNAMENT_STATUS_NUMBER_VALUES[1]}
                      </option>
                      <option value={2}>
                        {TOURNAMENT_STATUS_NUMBER_VALUES[2]}
                      </option>
                      <option value={3}>
                        {TOURNAMENT_STATUS_NUMBER_VALUES[3]}
                      </option>
                    </select>
                  </div>
                );
              }
              case 'city':
              case 'address':
              case 'name': {
                return (
                  <div
                    key={key}
                    className={cl(styles.field, styles.inputField)}
                  >
                    <span>{translation[key]}</span>
                    <input
                      value={activeTournament[key] as string}
                      type="text"
                      onChange={(e) =>
                        setActiveTournament((v) => ({
                          ...v,
                          [key]: e.target.value,
                        }))
                      }
                    />
                  </div>
                );
              }
              case 'start_date': {
                return (
                  <div
                    key={key}
                    className={cl(styles.field, styles.inputField)}
                  >
                    <span>Дата начала</span>
                    {/* FIXME: types and date format */}
                    {/* @ts-ignore  */}
                    <input
                      // todo: fix date input/output
                      disabled
                      // values should be taken from activeTournament
                      // value={activeTournament.start_date ? format(activeTournament.start_date, 'yyyy-MM-dd') : ''}
                      // valueAsDate={activeTournament.start_date as any§§}
                      type="date"
                      onChange={(e) =>
                        setActiveTournament((v) => ({
                          ...v,
                          [key]: new Date(e.target.value),
                        }))
                      }
                    />
                  </div>
                );
              }
              case 'associated_tournament_id':
              case 'players_order':
              case 'draw':
              case 'is_finished': {
                return null;
              }
              case 'is_doubles': {
                return (
                  <div
                    key={key}
                    className={cl(styles.field, styles.is_doubles)}
                  >
                    <span>Парный турнир</span>
                    <input
                      checked={!!activeTournament.is_doubles}
                      type="checkbox"
                      onChange={(e) => {
                        setActiveTournament((v) => ({
                          ...v,
                          [key]: e.target.checked,
                        }));
                      }}
                    />
                  </div>
                );
              }
              case 'surface': {
                return (
                  <div key={key} className={cl(styles.field, styles.surface)}>
                    <span>Покрытие</span>
                    <select name="surface">
                      <option value={0}>{SURFACE_TYPE_NUMBER_VALUES[0]}</option>
                      <option value={1}>{SURFACE_TYPE_NUMBER_VALUES[1]}</option>
                      <option value={2}>{SURFACE_TYPE_NUMBER_VALUES[2]}</option>
                    </select>
                  </div>
                );
              }
              default: {
                return (
                  <div key={key} className={cl(styles.field)}>
                    <span>{key}</span>
                    <span>{JSON.stringify(value)}</span>
                  </div>
                );
              }
            }
          })}
          <div className={styles.controlButtons}>
            <button
              disabled={
                JSON.stringify(tournament) === JSON.stringify(activeTournament)
              }
              onClick={() => updateActiveTournament()}
            >
              Сохранить
            </button>
            <button
              disabled={
                JSON.stringify(tournament) === JSON.stringify(activeTournament)
              }
              onClick={() => setActiveTournament(tournament)}
            >
              Отменить
            </button>
          </div>
        </div>
        <div className={cl(styles.side, styles.addPlayersContainer)}>
          <MultiSelect
            disabled={isDisabled}
            options={playersToMultiSelectFormat(players)}
            value={newSelectedPlayers}
            onChange={setNewSelectedPlayers}
            labelledBy="Выбирите игроков из списка"
          />
          <div className={styles.controlButtons}>
            <button
              disabled={isDisabled || newSelectedPlayers.length === 0}
              onClick={() => updateActiveTournament()}
            >
              Сохранить
            </button>
            <button
              disabled={isDisabled || newSelectedPlayers.length === 0}
              onClick={() => setNewSelectedPlayers([])}
            >
              Отменить
            </button>
          </div>
          <div className={styles.playersListContainer}>
            {newSelectedPlayersIds.length > 0 ? (
              <>
                <p className={styles.playersListTitle}>Новые игроки</p>
                <div className={cl(styles.playersList, styles.new)}>
                  {players.map((v) =>
                    newSelectedPlayersIds.indexOf(v.id) !== -1 ? (
                      <div key={v.id} className={styles.player}>
                        <span>{`${v.first_name} ${v.last_name}`}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </>
            ) : null}
            <p className={styles.playersListTitle}>Уже зарегестрировавшиеся</p>
            <div className={styles.playersList}>
              {registeredPlayersIds &&
                players.map((v) =>
                  registeredPlayersIds.indexOf(v.id) !== -1 ? (
                    <div key={v.id} className={styles.player}>
                      <span>{`${v.first_name} ${v.last_name}`}</span>
                    </div>
                  ) : null
                )}
            </div>
          </div>
        </div>
      </div>
      {activeTournament.draw_type ? (
        <TournamentDraw
          isDoubles={!!activeTournament.is_doubles}
          isDisabled={isDisabled}
          matches={matches}
          brackets={brackets || [[]]}
          registeredPlayers={registeredPlayers}
          openModalForNewMatch={openModalForNewMatch}
          openModalForExistingMatch={openModalForExistingMatch}
        />
      ) : (
        'Выбирите тип сетки турнира чтобы создать турнир'
      )}
      {modalStatus.isOpen && (
        <Modal title="Редактировать матч" handleClose={handleReset}>
          <MatchForm
            isDoubles={!!activeTournament.is_doubles}
            match={editingMatchData?.newMatch as MatchT}
            onSubmit={onSubmit}
            registeredPlayers={registeredPlayers}
          />
        </Modal>
      )}
    </div>
  );
};

const MatchForm = ({
  isDoubles,
  match,
  onSubmit,
  registeredPlayers,
}: {
  registeredPlayers: PlayerT[];
  match?: MatchT;
  onSubmit: (v: MatchT) => Promise<void>;
  isDoubles: boolean;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      player1_id: null,
      player2_id: null,
      player3_id: null,
      player4_id: null,
      ...match,
      start_date: match?.start_date
        ? format(new Date(match?.start_date), 'yyyy-MM-dd')
        : null,
    },
  });

  return (
    <div className={formStyles.formContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputWithError errorMessage={errors.player1_id?.message}>
          <br />
          Игрок 1:
          <select
            {...register('player1_id', {
              required: true,
              valueAsNumber: true,
            })}
          >
            {registeredPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        <InputWithError errorMessage={errors.player2_id?.message}>
          <br />
          Игрок 2:
          <select
            {...register('player2_id', {
              required: false,
              valueAsNumber: true,
            })}
          >
            {registeredPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        {isDoubles && (
          <>
            <InputWithError errorMessage={errors.player3_id?.message}>
              <br />
              Пара игрока 1 - игрок 3:
              <select
                {...register('player3_id', {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                {registeredPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {`${p.last_name} ${(p.first_name as string)[0]}`}
                  </option>
                ))}
              </select>
            </InputWithError>
            <InputWithError errorMessage={errors.player4_id?.message}>
              <br />
              Пара игрока 2 - игрок 4:
              <select
                {...register('player4_id', {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                {registeredPlayers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {`${p.last_name} ${(p.first_name as string)[0]}`}
                  </option>
                ))}
              </select>
            </InputWithError>
          </>
        )}
        <InputWithError errorMessage={errors.winner_id?.message}>
          <br />
          Победитель - игрок 1 или игрок 2:
          <select
            {...register('winner_id', {
              required: true,
            })}
          >
            {registeredPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {`${p.last_name} ${(p.first_name as string)[0]}`}
              </option>
            ))}
          </select>
        </InputWithError>
        <InputWithError errorMessage={errors.start_date?.message}>
          <input
            placeholder="Начало матча"
            type="date"
            {...register('start_date', { required: false, valueAsDate: true })}
          />
        </InputWithError>
        <InputWithError errorMessage={errors.score?.message}>
          <input
            placeholder="Счет"
            {...register('score', {
              pattern: {
                value: /^(\d{1,2}-\d{1,2} ){1,5}/,
                message: 'correct format: 6-2 2-6 10-2',
              },
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

export default AdminSingleTournamentPape;

export const getServerSideProps = async (ctx: any) => {
  const prisma = new PrismaClient();

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: parseInt(ctx.query.pid),
    },
    include: {
      match: true,
    },
  });

  const { match, ...tournamentProps } = tournament as any;
  const players = await prisma.player.findMany();

  return {
    props: {
      tournament: tournamentProps,
      players,
      matches: match,
    },
  };
};
