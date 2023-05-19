import { FC } from 'react';
import { IMatch } from 'Interfaces/IMatchesToday';
import Link from 'next/link';
import { format } from 'date-fns';
import PlayerInfoMatchLive from './PlayerInfoMatchLive';

import { FiClock, FiYoutube } from 'react-icons/fi';
import { GiCheckMark } from 'react-icons/gi';
import styles from './TournamentMatchLive.module.scss';


type TypeGroupedMatches = {
    sortedGroupedMatches: [string, IMatch[]][];
};

const TournamentMatchLive: FC<TypeGroupedMatches> = ({ sortedGroupedMatches }) => {

  const nowDate = new Date();

  const isDoubles = (match: IMatch): boolean => {
    return !!match.player3 && !!match.player4;
  }

  const renderMatchIcon = (match: IMatch) => {
    switch(true) {
      case match.time > nowDate && !match.winner_id:
        return <FiClock />;
      
      case match.time < nowDate && !match.winner_id:
        return <div className={styles.circle}></div>;

      case match.winner_id !== null:
        return <GiCheckMark size={15} />;

      default:
        return null;
    }
  };

  const renderMatchScore = (match: IMatch) => {
    switch(true) {
      case match.time > nowDate && !match.winner_id:
        return format(match.time, 'HH:mm dd.MM');

      case match.time < nowDate && !match.winner_id && !match.score:
        return 'Идёт';

      case match.time < nowDate && !match.winner_id && match.score:
        return match.score;

      case match.winner_id !== null:
        return match.score;

      default:
        return null;
    }
  };

  return (
    <div className={styles.tabContentLiveMatches}>
      {sortedGroupedMatches.map(([tournamentId, matches]) => (
        <div key={tournamentId} className={styles.innerTournament}>
          <Link href={`/tournaments/${tournamentId}`}>
            <a className={styles.title}>{matches[0].tournament.name}</a>
          </Link>
          {matches.map((match) => (
            <div key={match.id} className={styles.innerMatches}>
              <div className={styles.icon}>
                { renderMatchIcon(match) }
              </div>
              <div className={styles.wrapperPlayers}>
                <div className={isDoubles(match) ? styles.playersFour : styles.playersTwo}>
                  {
                    isDoubles(match) ? (
                      <>
                        <div className={match.player1.id === Number(match.winner_id) ? styles.winner : ''}>
                          <PlayerInfoMatchLive 
                            player={match.player1} 
                            isDoubles={isDoubles(match)} 
                            winner={match.winner_id} 
                          />
                          <span>&nbsp;/&nbsp;</span>
                          <PlayerInfoMatchLive 
                            player={match.player3} 
                            isDoubles={isDoubles(match)} 
                            winner={match.winner_id} 
                          />
                        </div>
                        <div className={match.player2.id === Number(match.winner_id) ? styles.winner : ''}>
                          <PlayerInfoMatchLive 
                            player={match.player2} 
                            isDoubles={isDoubles(match)} 
                            winner={match.winner_id} 
                          />
                          <span>&nbsp;/&nbsp;</span>
                          <PlayerInfoMatchLive 
                            player={match.player4} 
                            isDoubles={isDoubles(match)} 
                            winner={match.winner_id} 
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <PlayerInfoMatchLive 
                          player={match.player1} 
                          isDoubles={isDoubles(match)} 
                          winner={match.winner_id} 
                        />
                        <span>&nbsp;-&nbsp;</span>
                        <PlayerInfoMatchLive 
                          player={match.player2} 
                          isDoubles={isDoubles(match)} 
                          winner={match.winner_id} 
                        />
                      </>
                    )
                  }
                </div>
                {
                  match.youtube_link && (
                    <a href={match.youtube_link} className={styles.linkYouTube}>
                      <FiYoutube className={match.time < nowDate && !match.winner_id ? styles.youTubeAnimation : ''} />
                    </a>
                  )
                }
                <div className={styles.currentScore}>{ renderMatchScore(match) }</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TournamentMatchLive;