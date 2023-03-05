import Link from 'next/link';
import { AiOutlineYoutube } from 'react-icons/ai';
import { format } from 'date-fns';
import cl from 'classnames';

import { MatchWithTournamentType, getOpponents } from 'utils/getOpponents';
import { isPlayerWon } from 'utils/isPlayerWon';
import { DOUBLES_TOURNAMENT_TYPES_NUMBER } from 'constants/values';
import { HeadToHead } from 'layouts/MainAppLayoutIcons';
import styles from './MatchListElement.module.scss';

type MatchProps = {
  match: MatchWithTournamentType;
  playerId?: number;
};

const Match = ({ match, playerId }: MatchProps) => {
  const {
    tournament,
    start_date,
    youtube_link,
    score,
    winner_id,
    player1_id,
    player2_id,
  } = match;

  return (
    <div className={styles.match}>
      <div className={styles.row}>
        <span className={styles.tournamentName}>
          <Link href={`/tournaments/${tournament.id}`}>{tournament.name}</Link>
          <span className={styles.time}>
            {' ('}
            {start_date && format(new Date(start_date), 'dd.MM.yyyy')}
            {')'}
          </span>
        </span>
        <div className={styles.buttons}>
          {youtube_link && (
            <Link href={youtube_link}>
              <a>
                <AiOutlineYoutube />
              </a>
            </Link>
          )}
          {!DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
            tournament.tournament_type as number
          ) && (
            <Link
              href={`/h2h/compare?p1Id=${match.player1_id}&p2Id=${match.player2_id}`}
            >
              <a>
                <HeadToHead
                  withText={false}
                  style={{
                    position: 'relative',
                    top: 5,
                  }}
                />
              </a>
            </Link>
          )}
        </div>
      </div>
      <div className={styles.row}>
        <span className={styles.players}>
          {playerId ? (
            <>
              <i> vs. </i>
              {getOpponents(playerId, match)}
            </>
          ) : (
            <>
              <span
                className={
                  !playerId
                    ? isPlayerWon(player1_id as number, match)
                      ? styles.win
                      : ''
                    : undefined
                }
              >
                {!playerId && getOpponents(player2_id as number, match)}
              </span>
              <i> vs. </i>
              <span
                className={
                  !playerId
                    ? isPlayerWon(player2_id as number, match)
                      ? styles.win
                      : ''
                    : undefined
                }
              >
                {!playerId && getOpponents(player1_id as number, match)}
              </span>
            </>
          )}
        </span>
        <span
          className={cl(
            styles.score,
            playerId
              ? isPlayerWon(playerId, match)
                ? styles.win
                : styles.lose
              : ''
          )}
        >
          <Score score={score || ''} />
        </span>
      </div>
    </div>
  );
};

const Score = ({ score }: { score: string }) => {
  if (score.includes('w/o')) {
    return <span>{score}</span>;
  }

  const setStrings = score.split(' ');
  if (setStrings.length > 0) {
    return (
      <>
        {score.split(' ').map((setScore, i) => (
          <span key={setScore + i} className={styles.setScoreCol}>
            {setScore.replace('-', ' ')}
          </span>
        ))}
      </>
    );
  }

  return null;
};

export default Match;
