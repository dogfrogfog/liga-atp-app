import { ChangeEvent, useState } from 'react';
import type { NextPage } from 'next';
import { AiOutlineSave, AiFillEdit } from 'react-icons/ai';
import cl from 'classnames';
import { PrismaClient, tournament as TournamentT, player as PlayerT, match as MatchT } from '@prisma/client';
import { MultiSelect, Option } from 'react-multi-select-component';

import DataForm from 'components/admin/DataForm';
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
import { updateTournament } from 'services/tournaments';
import { createMatch, updateMatch, updateScore } from 'services/matches';
import styles from './AdminSingleTournamentPape.module.scss';

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

interface IBracketsUnit {
  stageIndex?: number;
  matchInStageIndex?: number;
  matchId?: number;
  player1?: number;
  player2?: number;
  player3?: number;
  player4?: number;
  team1Id?: number;
}

const getInitialBrackets = (drawType: number) => {
  const { totalStages, firstStageMatches } = DRAW_TYPE_NUMBER_VALUES[drawType];
  let stageMatches = firstStageMatches;

  const result: MatchT[][] = [[]];
  for (let i = 0; i < totalStages; i += 1) {
    result[i] = Array(stageMatches).fill({});
    stageMatches = stageMatches / 2;
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
  const [matches, setMatches] = useState(metchesOriginal);
  const [activeTournament, setActiveTournament] = useState(tournament);
  const [newSelectedPlayers, setNewSelectedPlayers] = useState([] as Option[]);

  // for match
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);
  const [editingMatch, setEditingMatch] = useState<MatchT>();

  const registeredPlayersIds = activeTournament.players_order ? JSON.parse(activeTournament?.players_order)?.players : [];
  const newSelectedPlayersIds = multiSelectFormatToPlayersIds(newSelectedPlayers);
  const brackets = activeTournament.draw && JSON.parse(activeTournament?.draw)?.brackets;

  const updateActiveTournament = async () => {
    const newSelectedPlayersIds = newSelectedPlayers.reduce(
      (acc, v) => ([...acc, v.value]),
      [] as Option[],
    );

    const newTournament = await updateTournament({
      ...activeTournament,
      players_order: JSON.stringify({
        players: registeredPlayersIds.concat(newSelectedPlayersIds),
      }),
      draw: activeTournament.draw_type ? JSON.stringify({
        // @ts-ignore
        brackets: brackets || getInitialBrackets(activeTournament.draw_type),
      }) : null,
      draw_type: parseInt(activeTournament.draw_type as any as string, 10),
      tournament_type: parseInt(activeTournament.tournament_type as any as string, 10)
    });
    
    if (newTournament.isOk) {
      // @ts-ignore
      const { match, ...v } = newTournament.data;

      setActiveTournament(v as any);
      setNewSelectedPlayers([]);
    }
  }

  const handleTournamentFieldChange = (key: string, value: any) => {
    setActiveTournament(v => ({ ...v, [key]: value }));
  };

  // to create new match and draw when its not exists
  // main work should be here
  // this function should create or modify tournament
  const createMatchAndUpdateBracket = async (newBracketUnit: IBracketsUnit) => {
    const createdMatch = await createMatch({
      tournament_id: activeTournament.id,
      player1_id: newBracketUnit.player1 || null,
      player2_id: newBracketUnit.player2 || null,
      player3_id: newBracketUnit.player3 || null,
      player4_id: newBracketUnit.player4 || null,
      is_completed: false,
      start_date: new Date(),
    } as MatchT);

    if (createdMatch.isOk) {
      const match = createdMatch.data as MatchT;

      setMatches(v => v.concat([match as MatchT]));

      // todo: add helper to convert data
      // or transform data in serverSideProps
      const currentBrackets: IBracketsUnit[][] = JSON.parse(activeTournament.draw as string).brackets;
      const newBrackets = currentBrackets.map((s, si) => (
        s.map((m, mi) =>
          si === newBracketUnit.stageIndex &&
            mi === newBracketUnit.matchInStageIndex ?
            { ...newBracketUnit, matchId: match.id } : m,
        )
      ));
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
      }
    }
  };

  const updateMatchAndBracket = async (newBracketUnit: IBracketsUnit, matchToUpdate: MatchT) => {
    // todo refactor this part LATER!!!!
    // prevent duplication
    const currentBrackets: IBracketsUnit[][] = JSON.parse(activeTournament.draw as string).brackets;
    const newBrackets = currentBrackets.map((s, si) => (
      s.map((m, mi) =>
        si === newBracketUnit.stageIndex &&
          mi === newBracketUnit.matchInStageIndex ?
          { ...m, ...newBracketUnit } : m,
      )
    ));
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
    }

    const updatedMatch = await updateMatch({
      id: matchToUpdate.id,
      player1_id: newBracketUnit.player1 || matchToUpdate.player1_id,
      player2_id: newBracketUnit.player2 || matchToUpdate.player2_id,
      player3_id: newBracketUnit.player3 || matchToUpdate.player3_id,
      player4_id: newBracketUnit.player4 || matchToUpdate.player4_id,
    } as MatchT);

    if (updatedMatch.isOk) {
      const { data } = updatedMatch;

      setMatches(v => {
        return v.map(v1 => v1.id === data?.id ? data : v1);
      });
    }
  };

  const isDisabled = 
    // OLD db records has is_finished prop...so we check it
    // (activeTournament.is_finished !== null && activeTournament.is_finished) ||
    // NEW db records has status prop...one of statuses is finished (equal to 3)....so we check it
    // (activeTournament.status === 3);
    false;

  const openEditMatchModal = (match: any) => {
    setModalStatus({ isOpen: true, type: 'update' });
    setEditingMatch(v => ({ ...v, ...match }));
  };

  const handleMatchFieldChange = (key: string, value: any) => {
    // @ts-ignore
    setEditingMatch(v => ({ ...v, [key]: value }));
  };

  console.log(editingMatch)

  return (
    <div>
      <PageTitle>
        Управление турниром
      </PageTitle>
      <div className={styles.twoSides}>
        <div className={cl(styles.side, styles.fieldsContainer)}>
          {Object.entries(tournament).map(([key, value]) => {
            switch (key) {
              case 'draw_type': {
                return (
                  <div className={cl(styles.field, styles.drawType)} key={key}>
                    <span>
                      Тип сетки в турнире
                    </span>
                    <select
                      onChange={(e) => {
                        handleTournamentFieldChange('draw', JSON.stringify({ brackets: getInitialBrackets(parseInt(e.target.value, 10)) }));
                        handleTournamentFieldChange('draw_type', e.target.value);
                      }}
                      value={activeTournament.draw_type as number}
                      disabled={isDisabled}
                      name="drawType"
                    >
                      <option value={0}>not selected</option>
                      {Object.entries(TOURNAMENT_DRAW_TYPE_NUMBER_VALUES).map(([key, name]) => {
                        return <option key={key} value={key}>{name as string}</option>
                      })}
                    </select>
                  </div>
                )
              }
              case 'tournament_type': {
                return (
                  <div className={cl(styles.field, styles.type)} key={key}>
                    <span>
                      Тип турнира
                    </span>
                    <select
                      onChange={(e) => handleTournamentFieldChange('tournament_type', parseInt(e.target.value, 10))}
                      value={activeTournament.tournament_type as number}
                      disabled={isDisabled}
                      name="type"
                    >
                      <option value={0}>not selected</option>
                      {Object.entries(TOURNAMENT_TYPE_NUMBER_VALUES).map(([key, name]) => {
                        return <option key={key} value={key}>{name as string}</option>
                      })}
                    </select>
                  </div>
                )
              }
              case 'status': {
                return (
                  <div key={key} className={cl(styles.field, styles.status)}>
                    <span>
                      Статус
                    </span>
                    <select
                      onChange={(e) => handleTournamentFieldChange('status', parseInt(e.target.value, 10))}
                      value={activeTournament.status as number}
                      disabled={isDisabled}
                      name="type"
                    >
                      <option value={1}>{TOURNAMENT_STATUS_NUMBER_VALUES[1]}</option>
                      <option value={2}>{TOURNAMENT_STATUS_NUMBER_VALUES[2]}</option>
                      <option value={3}>{TOURNAMENT_STATUS_NUMBER_VALUES[3]}</option>
                    </select>
                  </div>
                )
              }
              case 'city':
              case 'address':
              case 'name': {
                return (
                  <div key={key} className={cl(styles.field, styles.inputField)}>
                    <span>{translation[key]}</span>
                    <input
                      value={activeTournament[key] as string}
                      type="text"
                      onChange={(e) => setActiveTournament(v => ({ ...v, [key]: e.target.value }))}
                    />
                  </div>
                )
              }
              case 'start_date': {
                return (
                  <div key={key} className={cl(styles.field, styles.inputField)}>
                    <span>Дата начала</span>
                    {/* FIXME: types and date format */}
                    {/* @ts-ignore  */}
                    <input
                      // todo: fix date input/output
                      disabled
                      // values should be taken from activeTournament
                      // value={activeTournament.start_date? format(activeTournament.start_date, 'yyyy-MM-dd')}
                      // valueAsDate={activeTournament.start_date as any§§}
                      type="date"
                      onChange={(e) => setActiveTournament(v => ({ ...v, [key]: new Date(e.target.value) }))}
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
                  <div key={key} className={cl(styles.field, styles.is_doubles)}>
                    <span>Парный турнир</span>
                    <input
                      checked={!!activeTournament.is_doubles}
                      type="checkbox"
                      onChange={(e) => {
                        setActiveTournament(v => ({ ...v, [key]: e.target.checked }))
                      }}
                    />
                  </div>
                )
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
              disabled={JSON.stringify(tournament) === JSON.stringify(activeTournament)}
              onClick={() => updateActiveTournament()}
            >
              Сохранить
            </button>
            <button
              disabled={JSON.stringify(tournament) === JSON.stringify(activeTournament)}
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
                <p className={styles.playersListTitle}>
                  Новые игроки
                </p>
                <div className={cl(styles.playersList, styles.new)}>
                  {players.map((v) => (
                    newSelectedPlayersIds.indexOf(v.id) !== -1 ? (
                      <div key={v.id} className={styles.player}>
                        <span>{`${v.first_name} ${v.last_name}`}</span>
                      </div>) : null
                  ))}
                </div>
              </>
            ) : null}
            <p className={styles.playersListTitle}>
              Уже зарегестрировавшиеся
            </p>
            <div className={styles.playersList}>
              {registeredPlayersIds && players.map((v) => (
                registeredPlayersIds.indexOf(v.id) !== -1 ? (
                  <div key={v.id} className={styles.player}>
                    <span>{`${v.first_name} ${v.last_name}`}</span>
                  </div>) : null
              ))}
            </div>
          </div>
        </div>
      </div>
      {activeTournament.draw_type ?
        <TournamentDraw
          createMatchAndUpdateBracket={createMatchAndUpdateBracket}
          updateMatchAndBracket={updateMatchAndBracket}
          openEditMatchModal={openEditMatchModal}
          isDoubles={!!activeTournament.is_doubles}
          brackets={brackets || [[]]}
          matches={matches}
          isDisabled={isDisabled}
          registeredPlayers={players.filter(({ id }) => registeredPlayersIds.indexOf(id) !== -1)}
        />
        : 'Выбирите тип сетки турнира чтобы создать турнир'}
      {/* {modalStatus.isOpen ?
        <DataForm
          type="players"
          formTitle={FORM_TITLES[modalStatus.type]}
          onSubmit={onSubmit}
          onClose={handleReset}
          editingRow={editingUser}
        />
        : null} */}
    </div>
  );
}

interface ITournamentDrawProps {
  brackets: IBracketsUnit[][];
  matches: MatchT[];
  isDisabled: boolean;
  registeredPlayers: PlayerT[];
  createMatchAndUpdateBracket: (bracketsUnit: IBracketsUnit) => Promise<void>;
  updateMatchAndBracket: (bracketsUnit: IBracketsUnit, match: MatchT) => Promise<void>;
  openEditMatchModal: (m: MatchT) => void;
  isDoubles: boolean;
}

const TournamentDraw = ({
  matches, // array f matches, linked to this tournament
  brackets,
  isDisabled,
  registeredPlayers,
  createMatchAndUpdateBracket,
  updateMatchAndBracket,
  isDoubles,
  openEditMatchModal,
}: ITournamentDrawProps) => {
  const [activeBracketsUnit, setActiveBracketsUnit] = useState<IBracketsUnit>({});

  const findMatchRecordById = (targetMatchId: number) => matches.find(({ id }) => id === targetMatchId);
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, si: number, mi: number) => {
    const selectedValue = e.target.value ? parseInt(e.target.value, 10) : '';

    setActiveBracketsUnit(v => {
      // when set p1 and p2 in one bracket and then change p1 in another bracket
      // leads to setting p2 from previous edited bracket to currently editing bracket 
      if (v.stageIndex !== undefined && v.stageIndex === si && v.matchInStageIndex === mi) {
        return {
          ...v,
          [e.target.name]: selectedValue,
        };
      } else {
        return {
          stageIndex: si,
          matchInStageIndex: mi,
          [e.target.name]: selectedValue,
        }
      }
    });
  };

  const save = ({
    match,
    bracketUnit,
  }: { match: MatchT | null, bracketUnit: IBracketsUnit }) => {
    if (match === null) {
      createMatchAndUpdateBracket(bracketUnit);
    } else {
      updateMatchAndBracket(bracketUnit, match)
    }
  };

  return (
    <div className={styles.drawContainer}>
      {brackets?.map((stage, si) => (
        <div key={si} className={styles.stageWrapper}>
          <div key={si} className={styles.stage}>
            <p className={styles.stageTitle}>{si + 1}</p>
            <div className={styles.matchesWrapper}>
              {Array.isArray(stage) && stage?.map((bracketUnit, mi) => {
                // render something for legacy draws (ideally remove this code)
                // if (bracketUnit.team1Id) {
                //   console.log(bracketUnit);
                //   return (
                //     <div>
                //       <div>
                //         hi
                //       </div>
                //     </div>
                //   );
                // }

                const isChanged =
                  activeBracketsUnit.stageIndex === si &&
                  activeBracketsUnit.matchInStageIndex === mi;

                const isP1Changed = !!(isChanged && activeBracketsUnit.player1);
                const isP2Changed = !!(isChanged && activeBracketsUnit.player2);
                const isP3Changed = !!(isChanged && activeBracketsUnit.player3);
                const isP4Changed = !!(isChanged && activeBracketsUnit.player4);

                const matchRecord = bracketUnit.matchId ? findMatchRecordById(bracketUnit.matchId) as MatchT : null;
                // if select was changed we take data from state
                // if select was not changed we take data from tournament.draw db field
                const p1 = (isP1Changed ? activeBracketsUnit.player1 : bracketUnit.player1) || '';
                const p2 = (isP2Changed ? activeBracketsUnit.player2 : bracketUnit.player2) || '';

                const p3 = (isP3Changed ? activeBracketsUnit.player3 : bracketUnit.player3) || '';
                const p4 = (isP4Changed ? activeBracketsUnit.player4 : bracketUnit.player4) || '';

                const newBracket = {
                  ...bracketUnit,
                  ...activeBracketsUnit,
                };

                return (
                  <div
                    key={si + mi}
                    className={styles.matchInputContainer}
                  >
                    <div className={styles.playersRow}>
                      <select
                        value={p1}
                        name="player1"
                        onChange={(e) => handleSelectChange(e, si, mi)}
                      >
                        <option value=''>not selected</option>
                        {registeredPlayers.map(({ id, first_name, last_name }) => (
                          <option key={id} value={id}>{last_name + ' ' + first_name}</option>
                        ))}
                      </select>
                      {isDoubles && (
                        <select
                          value={p3}
                          name="player3"
                          onChange={(e) => handleSelectChange(e, si, mi)}
                        >
                          <option value=''>not selected</option>
                          {registeredPlayers.map(({ id, first_name, last_name }) => (
                            <option key={id} value={id}>{last_name + ' ' + first_name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className={styles.playersRow}>
                      <select
                        value={p2}
                        name="player2"
                        onChange={(e) => handleSelectChange(e, si, mi)}
                      >
                        <option value=''>not selected</option>
                        {registeredPlayers.map(({ id, first_name, last_name }) => (
                          <option key={id} value={id}>{last_name + ' ' + first_name}</option>
                        ))}
                      </select>
                      {isDoubles && (
                        <select
                          value={p4}
                          name="player4"
                          onChange={(e) => handleSelectChange(e, si, mi)}
                        >
                          <option value=''>not selected</option>
                          {registeredPlayers.map(({ id, first_name, last_name }) => (
                            <option key={id} value={id}>{last_name + ' ' + first_name}</option>
                          ))}
                        </select>
                      )}
                    </div>
                    <div className={styles.matchActionsButtons}>
                      {matchRecord &&
                        <button
                          className={styles.editMatch}
                          disabled={isDisabled}
                          onClick={() => openEditMatchModal(matchRecord)}
                        >
                          <AiFillEdit />{' '}Обновить матч
                        </button>
                      }
                      {isChanged &&
                        <button
                          className={styles.saveMatch}
                          disabled={isDisabled}
                          onClick={() => save({ bracketUnit: newBracket, match: matchRecord })}
                        >
                          <AiOutlineSave />{' '}Сохранить матч
                        </button>
                      }
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// const Match = ({ match }: { match?: any }) => (
//   <div key={match.id} className={styles.match}>
//     {[
//       match.player_match_player1_idToplayer,
//       match.player_match_player2_idToplayer,
//     ].map(({ id, first_name, last_name }) => (
//       <span
//         className={cl(styles.player, { [styles.loser]: id !== parseInt(match.winner_id, 10) })}
//         key={id}
//       >
//         {`${first_name} ${last_name}`}
//       </span>
//     ))}
//     <div className={styles.score}>{match.score}</div>
//   </div>
// );

export default AdminSingleTournamentPape;

export const getServerSideProps = async (ctx: any) => {
  const prisma = new PrismaClient();

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: parseInt(ctx.query.pid),
    },
    include: {
      match: {
        include: {
          player_match_player1_idToplayer: true,
          player_match_player2_idToplayer: true,
          player_match_player3_idToplayer: true,
          player_match_player4_idToplayer: true,
        }
      },
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
}