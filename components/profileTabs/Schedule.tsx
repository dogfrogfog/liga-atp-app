import { format } from 'date-fns';

import { getOpponents, MatchWithTournamentType } from 'utils/getOpponents';
import styles from './Schedule.module.scss';

type MatchProps = {
  tournamentName: string;
  startDate: Date | null;
  opponent: string;
};

const Match = ({ tournamentName, startDate, opponent }: MatchProps) => {
  const date = startDate && new Date(startDate);

  return (
    <div className={styles.match}>
      <div className={styles.row}>
        <span className={styles.tournamentName}>{tournamentName}</span>
        <span className={styles.matchDate}>
          {date && format(date, 'dd.MM')}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.opponent}>vs {opponent}</span>
        <span className={styles.matchDate}>
          {date && format(date, 'hh:mm')}
        </span>
      </div>
    </div>
  );
};

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
            startDate={v.start_date}
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
