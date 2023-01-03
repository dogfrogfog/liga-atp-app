import Link from 'next/link';
import { AiOutlineYoutube } from 'react-icons/ai';
import { GiTabletopPlayers } from 'react-icons/gi';
import { format } from 'date-fns';

import styles from './MatchListElement.module.scss';

type MatchProps = {
  tournamentName: string;
  startDate: string;
  p2Name: string;
  score: string;
  isMainPlayerWin: boolean;
  withCompareLink?: boolean;
  p1Name?: string;
};

const Match = ({
  tournamentName,
  startDate,
  p2Name,
  score,
  isMainPlayerWin,
  withCompareLink = false,
  p1Name = '',
}: MatchProps) => (
  // need to have all players' id here to set id to query params of link
  <div className={styles.match}>
    <span className={styles.time}>
      {format(new Date(startDate), 'dd.MM.yyyy')}
    </span>
    <div className={styles.row}>
      <span className={styles.tournamentName}>{tournamentName}</span>
      <div className={styles.buttons}>
        <Link href="/">
          <AiOutlineYoutube />
        </Link>
        {withCompareLink && (
          <Link href={`/h2h/compare?p1Id=${1883}&p2Id=${1881}`}>
            <GiTabletopPlayers />
          </Link>
        )}
      </div>
    </div>
    <div className={styles.row}>
      <span className={styles.players}>
        <span className={isMainPlayerWin ? styles.win : styles.lose}>
          {p1Name}
        </span>
        <i> vs. </i>
        <span className={!isMainPlayerWin ? styles.win : styles.lose}>
          {p2Name}
        </span>
      </span>
      <span
        className={!p1Name ? (isMainPlayerWin ? styles.win : styles.lose) : ''}
      >
        {score}
      </span>
    </div>
  </div>
);

export default Match;
