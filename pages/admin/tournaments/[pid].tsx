import { ChangeEvent, useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import cl from 'classnames';
import { tournament as TournamentT, match as MatchT } from '@prisma/client';
import { prisma } from 'services/db';
import { MultiSelect, Option } from 'react-multi-select-component';
import { format } from 'date-fns';

import {
  TOURNAMENT_DRAW_TYPE_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
  SURFACE_TYPE_NUMBER_VALUES,
  DEFAULT_MODAL,
  DOUBLES_TOURNAMENT_TYPES_NUMBER,
} from 'constants/values';
import PageTitle from 'ui-kit/PageTitle';
import Modal from 'ui-kit/Modal';
import { updateTournament } from 'services/tournaments';
import TournamentDraw, { IBracketsUnit } from 'components/admin/TournamentDraw';
import MatchForm from 'components/admin/MatchForm';
import { createMatch, updateMatch } from 'services/matches';
import { playersToMultiSelect, multiSelectToIds } from 'utils/multiselect';
import { getInitialBrackets } from 'utils/bracket';
import usePlayers from 'hooks/usePlayers';
import styles from './AdminSingleTournamentPape.module.scss';

// todo: https://github.com/dogfrogfog/liga-atp-app/issues/49
const translation = {
  city: 'Город',
  address: 'Адрес',
  name: 'Название',
};

interface IAdminSingleTournamentPapeProps {
  tournament: TournamentT;
  matches: MatchT[];
}

const AdminSingleTournamentPape: NextPage<IAdminSingleTournamentPapeProps> = ({
  tournament,
  matches: matchesOriginal,
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
  const { players } = usePlayers();
  const [matches, setMatches] = useState(matchesOriginal);
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
  const newSelectedPlayersIds = multiSelectToIds(newSelectedPlayers);
  const brackets =
    activeTournament.draw &&
    (JSON.parse(activeTournament?.draw)?.brackets as IBracketsUnit[][]);
  const unregPlayers: {
    first_name: string;
    last_name: string;
    phone?: string;
  }[] = activeTournament.unregistered_players
    ? JSON.parse(activeTournament.unregistered_players)
    : [];

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
      const { match, ...rest } = newTournament.data;

      setActiveTournament(rest);
      setNewSelectedPlayers([]);
    }

    setIsLoading(false);
  };

  const handleTournamentFieldChange = (key: string, value: string | number) => {
    setActiveTournament((v) => ({ ...v, [key]: value }));
  };

  const handleTournamentStartDateChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const newDate = e.target.value ? new Date(e.target.value) : null;

    if (newDate && newDate?.getFullYear() < 3000) {
      setActiveTournament((v) => ({ ...v, start_date: new Date(newDate) }));
    }
  };

  const onSubmit = async (match: MatchT) => {
    setIsLoading(true);
    if (
      editingMatchData?.si !== undefined &&
      editingMatchData?.mi !== undefined
    ) {
      const {
        player1_id,
        player2_id,
        player3_id,
        player4_id,
        winner_id,
        score,
        time,
      } = match;

      const createdMatch = await createMatch({
        tournament_id: activeTournament.id,
        player1_id,
        player2_id,
        player3_id,
        player4_id,
        winner_id,
        is_completed: false,
        time,
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
      <div className={styles.buttons}>
        <button className={styles.save}>Сохранить</button>
        <button className={styles.reset}>Отменить</button>
        <button className={cl(styles.delete)}>Удалить</button>
      </div>
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
                      <option>not selected</option>
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
                      <option>not selected</option>
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
                    <input
                      value={
                        activeTournament?.start_date
                          ? format(
                              new Date(activeTournament.start_date),
                              'yyyy-MM-dd'
                            )
                          : ''
                      }
                      type="date"
                      onChange={handleTournamentStartDateChange}
                    />
                  </div>
                );
              }
              case 'associated_tournament_id':
              case 'players_order':
              case 'unregistered_players':
              case 'draw':
              case 'is_doubles':
              case 'is_finished': {
                return null;
              }
              case 'surface': {
                return (
                  <div key={key} className={cl(styles.field, styles.surface)}>
                    <span>Покрытие</span>
                    <select name="surface">
                      <option>{SURFACE_TYPE_NUMBER_VALUES[0]}</option>
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
          <h3>
            <b>Игроки, зарегестрировавшиеся через приложение:</b>
          </h3>
          {unregPlayers.map(({ first_name, last_name, phone }) => (
            <p key={first_name + last_name}>
              <span>
                Имя: {first_name} {last_name}
              </span>
              {phone && <span>Телефон: {phone}</span>}
            </p>
          ))}
          <br />
          <MultiSelect
            disabled={isDisabled}
            options={playersToMultiSelect(players)}
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
          isDoubles={
            !!DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
              activeTournament.tournament_type as number
            )
          }
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
            isDoubles={
              !!DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
                activeTournament.tournament_type as number
              )
            }
            match={editingMatchData?.newMatch as MatchT}
            onSubmit={onSubmit}
            registeredPlayers={registeredPlayers}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminSingleTournamentPape;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: parseInt(ctx.query.pid as string),
    },
    include: {
      match: true,
    },
  });

  console.log(tournament);

  const { match, ...tournamentProps } = tournament as any;

  return {
    props: {
      tournament: tournamentProps,
      matches: match,
    },
  };
};
