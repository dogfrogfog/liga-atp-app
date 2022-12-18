import type {
  match as MatchT,
  player as PlayerT,
  tournament as TournamentT,
} from '@prisma/client';
import { format } from 'date-fns';

import styles from './Schedule.module.scss';

type MatchWithTournamentType = MatchT & {
  tournament: TournamentT;
  player_match_player1_idToplayer: PlayerT;
  player_match_player2_idToplayer: PlayerT;
  player_match_player3_idToplayer: PlayerT;
  player_match_player4_idToplayer: PlayerT;
};

const getOpponents = (playerId: number, players: PlayerT[]) => {
  if (players[0] && players[1] && players[0].id === playerId) {
    return `${(players[1].first_name as string)[0]}. ${players[1].last_name}`;
  }
  if (players[0] && players[1] && players[1].id === playerId) {
    return `${(players[0].first_name as string)[0]}. ${players[0].last_name}`;
  }

  return '';
};

type MatchProps = {
  tournamentName: string;
  startDate: string;
  opponent: string;
};

const Match = ({ tournamentName, startDate, opponent }: MatchProps) => (
  <div className={styles.match}>
    <div className={styles.row}>
      <span className={styles.tournamentName}>{tournamentName}</span>
      <span className={styles.matchTime}>{startDate}</span>
    </div>
    <div className={styles.row}>
      <span className={styles.opponent}>vs {opponent}</span>
      <span>
        <i>{'<место>'}</i>
      </span>
    </div>
  </div>
);

const ScheduleTab = ({
  playerId,
  upcomingMatches,
}: {
  playerId: number;
  upcomingMatches: MatchWithTournamentType[];
}) => {
  return (
    <div className={styles.matchesList}>
      {upcomingMatches.map((v) => (
        <Match
          key={v.id}
          tournamentName={v.tournament.name || ''}
          startDate={
            v.start_date ? format(new Date(v.start_date), 'dd.MM hh:mm') : ''
          }
          opponent={getOpponents(playerId, [
            v?.player_match_player1_idToplayer,
            v?.player_match_player2_idToplayer,
          ])}
        />
      ))}
    </div>
  );
};

export default ScheduleTab;
