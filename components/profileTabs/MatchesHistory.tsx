import type {
  match as MatchT,
  tournament as TournamentT,
  player as PlayerT,
} from '@prisma/client';
import Link from 'next/link';
import { format } from 'date-fns';
import { AiOutlineYoutube } from 'react-icons/ai';
import { GiTabletopPlayers } from 'react-icons/gi';

import { getOpponents } from 'utils/getOpponents';
import styles from './MatchesHistory.module.scss';

type MatchProps = {
  tournamentName: string;
  startDate: string;
  opponent: string;
  score: string;
  win: boolean;
};

const Match = ({
  tournamentName,
  startDate,
  opponent,
  score,
  win,
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
        <Link href={`/h2h?player1Id=${1}&player2Id=${2}`}>
          <GiTabletopPlayers />
        </Link>
      </div>
    </div>
    <div className={styles.row}>
      <span className={styles.opponent}>vs {opponent}</span>
      <span className={win ? styles.win : styles.lose}>{score}</span>
    </div>
  </div>
);

type MatchWithTournament = MatchT & {
  tournament: TournamentT;
  player_match_player1_idToplayer: PlayerT;
  player_match_player2_idToplayer: PlayerT;
  player_match_player3_idToplayer: PlayerT;
  player_match_player4_idToplayer: PlayerT;
};

const MatchesHistoryTab = ({
  playerId,
  playedMatches,
}: {
  playerId: number;
  playedMatches: MatchWithTournament[];
}) => {
  return (
    <>
      {playedMatches.map((match, index) => (
        <Match
          key={index}
          tournamentName={match.tournament.name || ''}
          startDate={
            match?.start_date
              ? format(new Date(match.start_date), 'yyyy-MM-dd')
              : ''
          }
          score={match?.score || ''}
          opponent={getOpponents(playerId, match)}
          win={String(playerId) === match.winner_id}
        />
      ))}
    </>
  );
};

export default MatchesHistoryTab;
