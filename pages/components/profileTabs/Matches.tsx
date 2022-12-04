import { useState, useEffect } from 'react';
import axios from 'axios';
import { match } from '@prisma/client';
import { format } from 'date-fns/fp';
import styles from './Matches.module.scss';

// comment: ""
// id: 10641
// is_completed: 1
// player1_id: 1220
// player2_id: 338
// player3_id: null
// player4_id: null
// score: "6-1 6-3"
// stage: 7
// start_date: "2020-11-01"
// tournament_id: 478
// winner_id: 1220

interface IMatchProps {
  tournamentName: string;
  startDate: string;
  opponent: string;
  score: string;
  win: boolean;
}

const Match = ({
  tournamentName,
  startDate,
  opponent,
  score,
  win,
}: IMatchProps) => (
  <div className={styles.match}>
    <span className={styles.time}>
      {format('dd.MM.yyyy', new Date(startDate))}
    </span>
    <div className={styles.row}>
      <span className={styles.tournamentName}>{tournamentName}</span>
      <span className={win ? styles.win : styles.lose}>{score}</span>
    </div>
    <div className={styles.row}>
      <span className={styles.pair}>{opponent}</span>
    </div>
    <div className={styles.row}>
      <div className={styles.button}>YouTube</div>
      <div className={styles.button}>H2H</div>
    </div>
  </div>
);

interface IMatchesTabProps {
  playerId: number;
}

const MatchesTab = ({ playerId }: IMatchesTabProps) => {
  const [data, setData] = useState<match[]>([]);
  const [pagination, setPagination] = useState({ take: 10, skip: 0 });

  // todo: move fetch to upper component and pass data as props
  useEffect(() => {
    const fetchWrapper = async () => {
      // todo: refactor
      // should be real pages
      const response = await axios.get(
        `/api/matches?take=${pagination.take}&skip=${pagination.skip}&id=${playerId}`
      );

      if (response.status === 200) {
        setData(response.data);
      }
    };

    fetchWrapper();
  }, [playerId, pagination]);
  return (
    <>
      {data.map((match, index) => (
        <Match
          key={index}
          // @ts-ignore
          tournamentName={match.tournament.name}
          // @ts-ignore
          startDate={match.start_date}
          // @ts-ignore
          score={match.score}
          opponent={
            // @ts-ignore
            match.player_match_player2_idToplayer.first_name +
            ' ' +
            (match as any).player_match_player2_idToplayer.last_name
          }
          win={String(playerId) === match.winner_id}
        />
      ))}
    </>
  );
};

export default MatchesTab;
