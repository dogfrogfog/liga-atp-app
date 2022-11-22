import { ChangeEvent, useState } from 'react';
import type { NextPage } from 'next';
import cl from 'classnames';
import { PrismaClient, tournament as TournamentT, player as PlayerT, match as MatchT } from '@prisma/client';
import { MultiSelect, Option } from 'react-multi-select-component';

import {
  TOURNAMENT_DRAW_TYPE_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
  // DOUBLES_TOURNAMENT_DRAW,
} from 'constants/values';
import { DRAW_TYPE_NUMBER_VALUES } from 'constants/draw';
import PageTitle from 'ui-kit/PageTitle';
import { updateTournament } from 'services/tournaments';
import { createMatch, updateMatch } from 'services/matches';
import styles from './AdminSingleTournamentPape.module.scss';
import { nullable } from 'zod';
import { GiConsoleController } from 'react-icons/gi';

interface IAdminSingleTournamentPapeProps {
  tournament: TournamentT;
  players: PlayerT[];
  matches: MatchT[];
}

interface IBracketsUnit {
  stageIndex?: number;
  matchInStageIndex?: number;
  matchId?: number;
  player1?: number,
  player2?: number,
  player3?: number,
  player4?: number,
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
      const { match, ...v } = newTournament.data;

      setActiveTournament(v as any);
      setNewSelectedPlayers([]);
    }
  }

  const handleTournamentFieldChange = (key: string, value: any) => {
    setActiveTournament(v => ({ ...v, [key]: value }));
  };

  const handleScoreChange = async (match: MatchT, score: string) => {
    const updatedMatch = await updateMatch({
      ...match,
      score,
    });

    if (updatedMatch.isOk) {
      const matchData = updatedMatch.data as MatchT;

      setMatches(v => v.concat([matchData]));
    }
  };

  const handleBracketsChange = async (newBracketUnit: IBracketsUnit, match: MatchT) => {
    const newPlayer1IdValue = newBracketUnit.player1 || match.player1_id;
    const newPlayer2IdValue = newBracketUnit.player1 || match.player1_id;
    // @ts-ignore
    const createdMatch = await createMatch({
      tournament_id: activeTournament.id,
      player1_id: newPlayer1IdValue,
      player2_id: newPlayer2IdValue,
      is_completed: false,
      start_date: new Date(),
    });

    if (createdMatch.isOk) {
      const match = createdMatch.data as MatchT;

      setMatches(v => v.concat([match as MatchT]));
      setActiveTournament(v => {
        const prevBrackets: IBracketsUnit[][] = JSON.parse(v.draw as string).brackets;

        const newBrackets = prevBrackets.map((s, si) => (
          s.map((m, mi) =>
            si === bracketsUnit.stageIndex &&
              mi === bracketsUnit.matchInStageIndex ?
              { ...bracketsUnit, matchId: match.id } : m,
          )
        ));

        return {
          ...v,
          draw: JSON.stringify({
            brackets: newBrackets,
          })
        };
      });
    }
  };

  const isDisabled = 
    // OLD db records has is_finished prop...so we check it
    // (activeTournament.is_finished !== null && activeTournament.is_finished) ||
    // NEW db records has status prop...one of statuses is finished (equal to 3)....so we check it
    // (activeTournament.status === 3);
    false;

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
                      onChange={(e) => handleTournamentFieldChange('draw_type', e.target.value)}
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
                    <span>Статус</span>
                    {/* @ts-ignore */}
                    <span>{TOURNAMENT_STATUS_NUMBER_VALUES[activeTournament.is_finished ? 3 : activeTournament?.status]}</span>
                  </div>
                );
              }
              case 'address':
              case 'name': {
                return (
                  <div key={key} className={cl(styles.field, styles.inputField)}>
                    <span>{key}</span>
                    <input
                      value={activeTournament[key] as string}
                      type="text"
                      onChange={(e) => setActiveTournament(v => ({ ...v, [key]: e.target.value }))}
                    />
                  </div>
                )
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
          handleBracketsChange={handleBracketsChange}
          handleScoreChange={handleScoreChange}
          brackets={brackets || [[]]}
          matches={matches}
          isDisabled={isDisabled}
          registeredPlayers={players.filter(({ id }) => registeredPlayersIds.indexOf(id) !== -1)}
        /> : 'Выбирите тип сетки турнира чтобы создать турнир'}
    </div>
  );
}

interface ITournamentDrawProps {
  brackets: IBracketsUnit[][];
  matches: MatchT[];
  isDisabled: boolean;
  registeredPlayers: PlayerT[];
  handleBracketsChange: (v: IBracketsUnit, match: MatchT) => void;
  handleScoreChange: any;
}

const TournamentDraw = ({
  matches, // array f matches, linked to this tournament
  brackets,
  isDisabled,
  registeredPlayers,
  handleBracketsChange,
  handleScoreChange,
}: ITournamentDrawProps) => {
  const [matchData, setMatchData] = useState<{ match: MatchT, bracketUnit: IBracketsUnit }>({ match: {}, bracketUnit: {} });

  const findMatchRecordById = (targetMatchId: number) => matches.find(({ id }) => id === targetMatchId);
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>, si: number, mi: number) => {
    const selectedValue = e.target.value ? parseInt(e.target.value, 10) : '';

    setMatchData(v => ({
      match: {
        ...v.match,
        [e.target.name]: selectedValue,
      },
      bracketUnit: {
        ...v.bracketUnit,
        [e.target.name]: selectedValue,
        stageIndex: si,
        matchInStageIndex: mi,
      },
    }));
  };

  // add match to bracket
  const saveMatch = (bracketMatch: IBracketsUnit) => {
    // const isMatchEdited = 
    // newBracketElement?.matchInStageIndex === match;
    if (matchData.bracketUnit) {
      // GiConsoleController.
      console.log(matchData.bracketUnit);
      // handleBracketsChange(newBracketElement, match)
    }
  };

  console.log(matchData);

  return (
    <div className={styles.drawContainer}>
      {brackets.map((stage, si) => (
        <div className={styles.stageWrapper}>
          <div key={si} className={styles.stage}>
            <p className={styles.stageTitle}>{si + 1}</p>
            <div className={styles.matchesWrapper}>
              {stage.map((bracketUnit, mi) => {
                const isChanged =
                  matchData.bracketUnit?.stageIndex === si &&
                  matchData.bracketUnit?.matchInStageIndex === mi;

                const matchRecord = bracketUnit.matchId ? findMatchRecordById(bracketUnit.matchId) as MatchT : null;
                const showAddButton = isChanged;
                // we set select values
                // its either manually selected player or player from db record
                // const p1 = (isChanged && matchData.bracketUnit.player1) || matchRecord?.player1_id;
                // const p2 = (isChanged && matchData.bracketUnit.player2) || matchRecord?.player2_id;

                return (
                  <div
                    key={si + mi}
                    className={cl(styles.matchInputContainer, {
                      [styles.activeInput]: isChanged,
                    })}
                  >
                    <div className={styles.fields}>
                      <select
                        // disabled={}
                        value={matchRecord?.player1_id as number}
                        name="player1"
                        onChange={(e) => handleSelectChange(e, si, mi)}
                      >
                        <option value=''>not selected</option>
                        {registeredPlayers.map(({ id, first_name, last_name }) => (
                          <option key={id} value={id}>{first_name + ' ' + last_name}</option>
                        ))}
                      </select>
                      <select
                        value={matchRecord?.player2_id as number}
                        name="player2"
                        onChange={(e) => handleSelectChange(e, si, mi)}
                      >
                        <option value=''>not selected</option>
                        {registeredPlayers.map(({ id, first_name, last_name }) => (
                          <option key={id} value={id}>{first_name + ' ' + last_name}</option>
                        ))}
                      </select>
                      {!isChanged && matchRecord?.player1_id && matchRecord?.player2_id &&
                        <div className={styles.scoreInput}>
                          <input type="score" />
                          <button onClick={() => handleScoreChange(matchRecord,)}>
                            save
                          </button>
                        </div>}
                    </div>
                    {showAddButton &&
                      <button
                        disabled={isDisabled}
                        className={styles.plusButton}
                        onClick={() => saveMatch(match)}
                      >
                        +
                      </button>
                    }
                  </div>
                )
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