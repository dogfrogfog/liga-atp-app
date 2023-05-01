import type { ReactNode } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { getOpponents, MatchWithTournamentType } from 'utils/getOpponents';
import styles from './Schedule.module.scss';

type MatchProps = {
  tournamentName: string;
  time: Date | null;
  opponent: string | ReactNode;
  tournamentId: number;
  isDoubles: boolean;
};

const Match = ({
  tournamentName,
  time,
  opponent,
  tournamentId,
  isDoubles,
}: MatchProps) => {
  const date = time && new Date(time);

  return (
    <div className={styles.match}>
      <div className={styles.row}>
        <Link href={`/tournaments/${tournamentId}`}>
          <span className={styles.tournamentName}>{tournamentName}</span>
        </Link>
        <span className={styles.matchDate}>
          {date && format(date, 'EEEEEE H:mm', { locale: ru })}
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.opponent}>
          {!isDoubles && <i>vs.{' '}</i>}
          {opponent}
        </span>
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
            tournamentId={v.tournament.id}
            isDoubles={!!(v.tournament.is_doubles || ((v.player3_id && v.player4_id))) || false} // we have cases where 'is_doubles' is null but it's still a double tournament (has player3 and player4)
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
