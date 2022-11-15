import { ChangeEvent, SetStateAction, useState, Dispatch, ReactNode } from 'react';
import type { NextPage } from 'next';
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
}

// todo: serialize JSON and return a JSON object (for tournament.players_order and tournament.draw)
const AdminSingleTournamentPape: NextPage<IAdminSingleTournamentPapeProps> = ({
  tournament,
  players,
}) => {
  const { match, is_finished } = tournament;
  const [activeTournament, setActiveTournament] = useState(tournament);
  const [drawType, setDrawType] = useState(tournament.draw_type);
  const [newSelectedPlayers, setNewSelectedPlayers] = useState([] as Option[]);

  const handleDrawTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDrawType(parseInt(e.target.value));
  };

  const updateDrawType = async () => {
    const { tournament_players, match, ...rest } = activeTournament;

    const newTournament = await updateTournament({
      ...rest,
      draw_type: drawType,
      draw: '',
    });

    if (newTournament.isOk) {
      setActiveTournament(newTournament.data as any);
    }
  };

  console.log(tournament);

  const registeredPlayersIds = tournament.players_order ? JSON.parse(tournament?.players_order)?.players : [];
  const drawBrackets =  tournament?.draw ? JSON.parse(tournament?.draw)?.brackets : [];

  const saveNewPlayers = async () => {
    const newSelectedPlayersIds = newSelectedPlayers.reduce(
      (acc, v) => ([...acc, v.value]),
      [] as Option[],
    );
    const { tournament_players, match, ...rest } = activeTournament;
    const newTournament = await updateTournament({
      ...rest,
      players_order: JSON.stringify({
        players: registeredPlayersIds.concat(newSelectedPlayersIds),
      }),
    });

    if (newTournament.isOk) {
      setActiveTournament(newTournament.data as any);
      setNewSelectedPlayers([]); // to reset multiselect if saved with ok 200
    }
  };

  return (
    <div>
      <PageTitle>
        Управление турниром: <i>{activeTournament.name}</i> (статус: {TOURNAMENT_STATUS_NUMBER_VALUES[tournament?.status] || (is_finished && 'Завершен')})
      </PageTitle>
      <div>
        Тип турнира: {TOURNAMENT_TYPE_NUMBER_VALUES[activeTournament.tournament_type as number]}
      </div>
      <br />
      <div>
        Тип сетки в турнире:{' '}
        <select
          onChange={handleDrawTypeChange}
          value={drawType as number}
          disabled={!!is_finished}
          name="drawType"
        >
          <option value={0}>not selected</option>
          {Object.entries(TOURNAMENT_DRAW_TYPE_NUMBER_VALUES).map(([key, name]) => (
            <option key={key} value={key}>{name as string}</option>
          ))}
        </select>
      </div>
      <br />
      <div>
        <button
          disabled={!!is_finished}
          onClick={updateDrawType}
        >
          Изменить тип сетки
        </button>
      </div>
      <div className={styles.twoSides}>
        <div className={styles.addPlayersContainer}>
          <h3>Добавить игроков в турнир:</h3>
          <br />
          <AddNewPlayerBlock
            disabled={!!is_finished}
            players={players}
            newSelectedPlayers={newSelectedPlayers}
            setNewSelectedPlayers={setNewSelectedPlayers}
            SubmitButton={
              <button
                disabled={!!is_finished}
                onClick={saveNewPlayers}
                className={styles.submitButton}
              >
                Добавить
              </button>}
          />

        </div>
        <div className={styles.playersListContainer}>
          <h3>Добавить игроков в турнир:</h3>
          <br />
          <ul className={styles.playersToDragIntoDraw}>
            {registeredPlayersIds && players.map((v, index) => (
              registeredPlayersIds.indexOf(v.id) !== -1 ? (
                <li className={styles.registeredPlayer}>
                  {`${v.first_name} ${v.last_name}`}
                </li>) : null
            ))}
          </ul>
        </div>
      </div>
      <div>
        <h3>Сетка турнира</h3>
        <br />
        <TournamentDraw
          brackets={drawBrackets}
          matches={tournament.match}
        />
      </div>
    </div>
  );
}

const formatToMultiSelectFormat = (players: PlayerT[]) =>
  players.reduce((acc, v) => {
    acc.push({ value: v.id, label: `${v.first_name} ${v.last_name}` });
    return acc;
  }, [] as Option[]);

interface IAddNewPlayerBlockProps {
  disabled: boolean;
  players: PlayerT[];
  newSelectedPlayers: Option[];
  setNewSelectedPlayers: Dispatch<SetStateAction<Option[]>>;
  SubmitButton: ReactNode;
}

const AddNewPlayerBlock = ({
  disabled,
  players,
  newSelectedPlayers,
  setNewSelectedPlayers,
  SubmitButton,
}: IAddNewPlayerBlockProps) => {
  return (
    <div className={styles.addNewPlayerBlock}>
      <div className={styles.selectedOptionsContainer}>
        {newSelectedPlayers.map(({ label }) => (
          <span key={label} className={styles.selectedNameTag}>
            {label}
          </span>
        ))}
      </div>
      <div className={styles.addPlayersControls}>
        <MultiSelect
          disabled={disabled}
          className={styles.multiSelect}
          options={formatToMultiSelectFormat(players)}
          value={newSelectedPlayers}
          onChange={setNewSelectedPlayers}
          labelledBy="Выбирите игроков из списка"
        />
        {SubmitButton}
      </div>
    </div>
  );
}

interface ITournamentDrawProps {
  brackets: any;
  matches: MatchT[];
}

const getStagesFromBracket = () => {

};
// !!!старые данные будут уже упорядочены!!!
// 
// как их можно парсить:
// 1. у нас есть tournament.draw_type соответственно есть размер сетки
// 2. зная размер сетки мы можем определить количество матчей и построить сетку
//
// зная количества матчей в одном уровне рисовать сетку по принципу: 
// пример турнир q32
// 1 стадия. первых 16 элементов массива match
// 2 стаадия. 16 + 8
// 3 сталия. 16 + 8 + 4 и тд
// нужно проверить данные для даблс

// для новых турниров можно сразу формировать draw!!
// 1. у нас есть draw_type соответственно есть размер размер сетки
// 2. зная размер сетки мы можем определить количество матчей и построить сетку
// 3. заполняем сетку пустыми значениями (или алгоритмом который будет создавать объекты самостоятельно)
// 4. первый раунд будет списан после окончательного формирования, следовательно можно считать 


const TournamentDraw = ({ brackets, matches }: ITournamentDrawProps) => {
  // tournament with 819 id has all the props
  const a = brackets.reduce((acc, { id }) => {
    acc.push(parseInt(id, 2))
    return acc;
  }, [] as number[]);

  // should

  // console.log(brackets)
  // console.log(a)

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
      tournament_players: true,
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

  const players = await prisma.player.findMany();

  return {
    props: {
      // todo: move match and tournament_players props out of tournament
      // should be:
      // matches: match,
      // tournamentPlayers: tournament_players,
      tournament,
      players,
    },
  };
}