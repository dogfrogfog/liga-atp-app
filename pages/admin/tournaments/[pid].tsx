import { ChangeEvent, useState } from 'react';
import type { NextPage } from 'next';
import { PrismaClient, tournament as TournamentT } from '@prisma/client';

import {
  TOURNAMENT_DRAW_TYPE_NUMBER_VALUES,
  TOURNAMENT_TYPE_NUMBER_VALUES,
  TOURNAMENT_STATUS_NUMBER_VALUES,
} from 'constants/values';
import PageTitle from 'ui-kit/PageTitle';
import { updateTournament } from 'services/tournaments';
import { getPlayers } from 'services/players';

interface IAdminSingleTournamentPapeProps {
  tournament: TournamentT;
}

const AdminSingleTournamentPape: NextPage<IAdminSingleTournamentPapeProps> = ({ tournament }) => {
  const [activeTournament, setActiveTournament] = useState(tournament);
  const { match, is_finished } = tournament;
  const [drawType, setDrawType] = useState(tournament.draw_type);

  console.log(tournament)

  const handleDrawTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDrawType(parseInt(e.target.value));
  };

  const handleSaveDraw = async () => {
    const { data } = await getPlayers({ pageIndex: 40, pageSize: 20 });
    console.log(data)
    // const newTournament = await updateTournament({ ...activeTournament, draw_type: drawType, match: undefined, tournament_players: undefined });

    // if (newTournament.isOk) {
    //   setActiveTournament(newTournament.data as any);
    // }
  };

  return (
    <div>
      <PageTitle>
        Управление турниром: <i>{activeTournament.name}</i> (статус: {TOURNAMENT_STATUS_NUMBER_VALUES[tournament?.status]})
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
          onClick={handleSaveDraw}
        >
          Сохранить
        </button>
      </div>
      {is_finished ? (
        <div>
          <span>Добавить участница турнира</span>
          <h3>
            should show fixed + filled tournament net
          </h3>
        </div>
      ) : (
        <div>
          <h3>Создать сетку турнира</h3>
          <br />
          <CreateTournamentNet />
        </div>
      )}
    </div>
  );
}

const CreateTournamentNet = () => {
  return (
    <div>
      CreateTournamentNet 
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
      // easy to add related column
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

  return {
    props: {
      tournament,
    },
  };
}