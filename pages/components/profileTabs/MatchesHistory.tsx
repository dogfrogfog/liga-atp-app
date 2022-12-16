import { useState, useEffect } from 'react';
import axios from 'axios';
import { match as MatchT } from '@prisma/client';
import { format } from 'date-fns';
import styles from './MatchesHistory.module.scss';

type MatchProps = {
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
}: MatchProps) => (
  <div className={styles.match}>
    <span className={styles.time}>
      {format(new Date(startDate), 'dd.MM.yyyy')}
    </span>
    <div className={styles.row}>
      <span className={styles.tournamentName}>{tournamentName}</span>
      <div className={styles.buttons}>
        <div className={styles.button}>YouTube</div>
        <div className={styles.button}>H2H</div>
      </div>
    </div>
    <div className={styles.row}>
      <span className={styles.opponent}>vs {opponent}</span>
      <span className={win ? styles.win : styles.lose}>{score}</span>
    </div>
  </div>
);

type MatchesHistoryTabProps = {
  playerId: number;
}

const MatchesHistoryTab = ({ playerId }: MatchesHistoryTabProps) => {
  const [data, setData] = useState<MatchT[]>([]);

  // todo: move fetch to upper component and pass data as props
  useEffect(() => {
    const fetchWrapper = async () => {
      const response = await axios.get(`/api/matches?id=${playerId}`);

      if (response.status === 200) {
        setData(response.data);
      }
    };

    fetchWrapper();
  }, [playerId]);

  console.log(data);

  return (
    <>
      {data.map((match, index) => (
        <Match
          key={index}
          tournamentName={match.tournament.name}
          startDate={match.start_date}
          score={match.score}
          opponent={
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

export default MatchesHistoryTab;
