import type { ReactNode } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { getOpponents, MatchWithTournamentType } from 'utils/getOpponents';
import styles from './Schedule.module.scss';

type MatchProps = {
  tournamentName: string;
  time: Date | null;
  opponent: string | ReactNode;
};

const Match = ({ tournamentName, time, opponent }: MatchProps) => {
  const date = time && new Date(time);

  return (
    <div className={styles.match}>
      <div className={styles.row}>
        <span className={styles.tournamentName}>{tournamentName}</span>
        <span className={styles.matchDate}>
          {date && format(date, 'EEEEEE H:mm', { locale: ru })}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.opponent}>vs {opponent}</span>
        <span className={styles.matchDate}>
          {date && format(date, 'dd.MM')}
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
            time={v.time}
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
