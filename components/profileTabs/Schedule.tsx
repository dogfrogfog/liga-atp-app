import type {
  match as MatchT,
  player as PlayerT,
  tournament as TournamentT,
} from '@prisma/client';
import { format } from 'date-fns';

import { getOpponents, MatchWithTournamentType } from 'utils/getOpponents';
import styles from './Schedule.module.scss';

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
      {upcomingMatches.length > 0 ? (
        upcomingMatches.map((v) => (
          <Match
            key={v.id}
            tournamentName={v.tournament.name || ''}
            startDate={
              v.start_date ? format(new Date(v.start_date), 'dd.MM hh:mm') : ''
            }
            opponent={getOpponents(playerId, v)}
          />
        ))
      ) : (
        <div className={styles.noReg}>
          <p>
            Игрок не зарегестрирован
            <br />в предстоящих турнирах
          </p>
        </div>
      )}
    </div>
  );
};

export default ScheduleTab;
