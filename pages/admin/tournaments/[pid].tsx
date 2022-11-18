import { useState } from 'react';
import type { NextPage } from 'next';
import cl from 'classnames';
import { PrismaClient, tournament as TournamentT, player as PlayerT, match as MatchT } from '@prisma/client';
import { MultiSelect, Option } from 'react-multi-select-component';

import {
  TOURNAMENT_DRAW_TYPE_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
} from 'constants/values';
import PageTitle from 'ui-kit/PageTitle';
import { updateTournament } from 'services/tournaments';
import styles from './AdminSingleTournamentPape.module.scss';

interface IAdminSingleTournamentPapeProps {
  tournament: TournamentT;
  players: PlayerT[];
  matches: MatchT[];
}

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
  matches,
}) => {
  const [activeTournament, setActiveTournament] = useState(tournament);
  const [newSelectedPlayers, setNewSelectedPlayers] = useState([] as Option[]);

  const registeredPlayersIds = activeTournament.players_order ? JSON.parse(activeTournament?.players_order)?.players : [];
  const newSelectedPlayersIds = multiSelectFormatToPlayersIds(newSelectedPlayers);
  const drawBrackets =  tournament?.draw ? JSON.parse(tournament?.draw)?.brackets : [];

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
      // @ts-ignore
      draw_type: parseInt(activeTournament.draw_type, 10),
      // @ts-ignore
      tournament_type: parseInt(activeTournament.tournament_type, 10)
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

  const isDisabled = 
    // OLD db records has is_finished prop...so we check it
    (activeTournament.is_finished !== null && activeTournament.is_finished) ||
    // NEW db records has status prop...one of statuses is finished (equal to 3)....so we check it
    (activeTournament.status === 3);

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
            className={styles.multiSelect}
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
      <div>
        <h3>Сетка турнира</h3>
        <br />
        <TournamentDraw
          brackets={drawBrackets}
          matches={matches}
        />
      </div>
    </div>
  );
}

interface ITournamentDrawProps {
  brackets: any;
  matches: MatchT[];
}

const TournamentDraw = ({ brackets, matches }: ITournamentDrawProps) => {
  // console.log('brackets, matches:')
  // console.log(brackets, matches);

  return null;
  return (
    <div className={styles.drawContainer}>
      <div className={styles.stage}>
        <p>Stage 33</p>
        <div className={styles.matchesContainer}>
          <div className={styles.match}>
            <span>игрок 1</span>
            <span>игрок 2</span>
          </div>
          <div className={styles.match}>
            <span>игрок 1</span>
            <span>игрок 2</span>
          </div>
        </div>
      </div>
      <div className={styles.stage}>
        <p>Stage 33</p>
        <div className={styles.matchesContainer}>
          <div className={styles.match}>
            <span>игрок 1</span>
            <span>игрок 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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