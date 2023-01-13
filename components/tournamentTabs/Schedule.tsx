import { useState, isValidElement } from 'react';
import cl from 'classnames';
import type { match as MatchT, player as PlayerT } from '@prisma/client';
import { format } from 'date-fns';
import { useSpringCarousel } from 'react-spring-carousel';
import { FaQuestion } from 'react-icons/fa';
import { GiConsoleController, GiTrophyCup } from 'react-icons/gi';

import NotFoundMessage from 'ui-kit/NotFoundMessage';
import type { IBracketsUnit } from 'components/admin/TournamentDraw';
import { singleStagesNames, groupStagesNames } from 'constants/values';
import styles from './Schedule.module.scss';

type ScheculeTabProps = {
  brackets: IBracketsUnit[][];
  tournamentMatches: MatchT[];
  registeredPlayers: PlayerT[];
  isDoubles: boolean;
  hasGroups: boolean;
};

const ScheculeTab = ({
  brackets,
  tournamentMatches,
  registeredPlayers,
  isDoubles,
  hasGroups,
}: ScheculeTabProps) => {
  // because carousel doesn't allow us to get active thumb (to set active stage colors)
  const [activeStage, setActiveStage] = useState('0');
  const stagesNumber = brackets.length;
  const stages = hasGroups
    ? [
        'G',
        ...groupStagesNames.slice(groupStagesNames.length - stagesNumber + 1),
      ]
    : singleStagesNames.slice(singleStagesNames.length - stagesNumber);

  const matchesMap = tournamentMatches.reduce((acc, match) => {
    acc.set(match.id, match);
    return acc;
  }, new Map<number, MatchT>());

  const playersMap = registeredPlayers.reduce((acc, player) => {
    acc.set(player.id, player);
    return acc;
  }, new Map<number, PlayerT>());

  const {
    carouselFragment,
    thumbsFragment,
    slideToItem,
    getCurrentActiveItem,
  } = useSpringCarousel({
    withThumbs: true,
    touchAction: '',
    items: brackets.map((stage, i, arr) => ({
      id: i + '',
      renderItem: (
        <Stage
          stage={stage}
          isFinal={arr.length - 1 === i}
          isDoubles={isDoubles}
          matchesMap={matchesMap}
          playersMap={playersMap}
        />
      ),
      renderThumb: (
        <button
          onClick={() => {
            setActiveStage(i + '');
            slideToItem(i);
          }}
          className={cl(
            styles.stageButton,
            i + '' === activeStage ? styles.active : ''
          )}
        >
          {stages[i]}
        </button>
      ),
    })),
  });

  return (
    <div className={styles.container}>
      <div className={styles.bracketContainer}>
        <div className={styles.stageButtons}>{thumbsFragment}</div>
        <div className={styles.bracket}>{carouselFragment}</div>
      </div>
    </div>
  );
};

type StageProps = {
  stage: IBracketsUnit[];
  isDoubles: boolean;
  isFinal: boolean;
  matchesMap: Map<number, MatchT>;
  playersMap: Map<number, PlayerT>;
};

const Stage = ({
  stage,
  isDoubles,
  matchesMap,
  playersMap,
  isFinal,
}: StageProps) => (
  <div className={styles.stage}>
    {stage.map((bracketUnit, mi) => {
      if (Array.isArray(bracketUnit)) {
        return (
          <div key={mi} className={styles.groupWrapper}>
            <p className={styles.groupTitle}>Группа {mi + 1}</p>
            {bracketUnit.length > 0 ? (
              bracketUnit.map((v, gmi) => (
                <Match
                  className={styles.groupMatch}
                  key={gmi}
                  isFinal={isFinal}
                  isDoubles={isDoubles}
                  match={matchesMap.get(v.matchId)}
                  playersMap={playersMap}
                />
              ))
            ) : (
              <NotFoundMessage message="В группе пока нет матчей" />
            )}
          </div>
        );
      }

      const match = bracketUnit?.matchId && matchesMap.get(bracketUnit.matchId);

      return match ? (
        <Match
          key={mi}
          isFinal={isFinal}
          isDoubles={isDoubles}
          match={match}
          playersMap={playersMap}
        />
      ) : (
        <div key={mi} className={styles.matchDoesntExists}>
          <FaQuestion />
        </div>
      );
    })}
  </div>
);

const Match = ({
  isDoubles,
  match,
  playersMap,
  isFinal,
  className,
}: {
  isFinal: boolean;
  isDoubles: boolean;
  match?: MatchT;
  playersMap: Map<number, PlayerT>;
  className?: string;
}) => {
  const isPlayed = match?.winner_id && match.score;
  const p1 = match?.player1_id ? playersMap.get(match.player1_id) : undefined;
  const p2 = match?.player2_id ? playersMap.get(match.player2_id) : undefined;
  const p3 = match?.player3_id ? playersMap.get(match.player3_id) : undefined;
  const p4 = match?.player4_id ? playersMap.get(match.player4_id) : undefined;

  const p1Name = p1 ? (
    `${(p1.first_name as string)[0]}. ${p1.last_name}`
  ) : (
    <FaQuestion />
  );
  const p2Name = p2 ? (
    `${(p2.first_name as string)[0]}. ${p2.last_name}`
  ) : (
    <FaQuestion />
  );
  const p3Name = p3 ? (
    `${(p3.first_name as string)[0]}. ${p3.last_name}`
  ) : (
    <FaQuestion />
  );
  const p4Name = p4 ? (
    `${(p4.first_name as string)[0]}. ${p4.last_name}`
  ) : (
    <FaQuestion />
  );

  const matchDate = match?.start_date ? new Date(match.start_date) : null;

  return (
    <div className={cl(styles.match, className)}>
      <div className={styles.row}>
        <div className={styles.left}>
          {/* if no data - return question mark component */}
          {!isDoubles && !isValidElement(p1Name) && (
            <span className={styles.img}>{/* <Image src={iconSrc} /> */}</span>
          )}
          <span
            className={cl(
              styles.name,
              isPlayed &&
                parseInt(match?.winner_id as string, 10) === match?.player1_id
                ? styles.winner
                : ''
            )}
          >
            {p1Name} {isDoubles && `/`} {isDoubles && p3Name}
          </span>
        </div>
        <div className={styles.right}>
          {isPlayed ? (
            <span className={styles.score}>{match.score}</span>
          ) : (
            <span className={styles.matchDate}>
              {matchDate && format(matchDate, 'dd.MM')}
            </span>
          )}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.left}>
          {/* if no data - return question mark component */}
          {!isDoubles && !isValidElement(p2Name) && (
            <span className={styles.img}>{/* <Image src={iconSrc} /> */}</span>
          )}
          <span
            className={cl(
              styles.name,
              isPlayed &&
                parseInt(match?.winner_id as string, 10) === match?.player2_id
                ? styles.winner
                : ''
            )}
          >
            {p2Name} {isDoubles && `/`} {isDoubles && p4Name}
          </span>
        </div>
        <div className={styles.right}>
          <span className={styles.matchDate}>
            {matchDate && format(matchDate, isPlayed ? 'dd.MM' : 'HH:mm')}
          </span>
        </div>
      </div>
      {isFinal && (
        <div className={styles.finalsTrophy}>
          <GiTrophyCup />
        </div>
      )}
    </div>
  );
};

export default ScheculeTab;
