import { isValidElement, forwardRef, useState, TouchEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import cl from 'classnames';
import type { match as MatchT, player as PlayerT } from '@prisma/client';
import { format } from 'date-fns';
import { useSpringCarousel } from 'react-spring-carousel';
import { FaQuestion } from 'react-icons/fa';
import { GiTrophyCup } from 'react-icons/gi';
import { BsFillPersonFill } from 'react-icons/bs';

import NotFoundMessage from 'ui-kit/NotFoundMessage';
import type { IBracketsUnit } from 'components/admin/TournamentDraw';
import { singleStagesNames, groupStagesNames } from 'constants/values';
import styles from './Schedule.module.scss';

type ScheduleTabProps = {
  brackets: IBracketsUnit[][];
  tournamentMatches: MatchT[];
  registeredPlayers: PlayerT[];
  isDoubles: boolean;
  hasGroups: boolean;
};

const ScheduleTab = forwardRef<any, ScheduleTabProps>(
  (
    { brackets, tournamentMatches, registeredPlayers, isDoubles, hasGroups },
    downloadImageRef
  ) => {
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

    const [activeStage, setActiveStage] = useState(0);
    const [touchStart, setTouchStart]  = useState<null | number>(null);
    const [touchEnd, setTouchEnd]  = useState<null | number>(null);

    const { carouselFragment, thumbsFragment, slideToItem } = useSpringCarousel(
      {
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
              isTouchStartNeeded
              onTouchStart={(e) => {
                setTouchStart(e.changedTouches[0].screenX);
              }}
              isTouchEndNeeded
              onTouchEnd={(e) => {
                e.stopPropagation();

                if (touchStart === null) {
                  return;
                }

                setTouchEnd(e.changedTouches[0].screenX);

                if (touchEnd === null) {
                  return;
                }
                
                const diff = touchStart - touchEnd;

                if (i === arr.length - 1 && diff > 0) {
                  setTouchStart(null);
                  setTouchEnd(null);
                  return;
                }

                if (i === 0 && diff < 0) {
                  setTouchStart(null);
                  setTouchEnd(null);
                  return;
                }
                
                if (diff < 102 && diff > -102) {
                  setTouchStart(null);
                  setTouchEnd(null);
                  return;
                }

                if (diff >= 102) {
                  setActiveStage(i + 1);
                  setTouchStart(null);
                  setTouchEnd(null);
                  return;
                }

                if (diff <= 102) {
                  setActiveStage(i - 1);
                  setTouchStart(null);
                  setTouchEnd(null);
                  return;
                }
              }}
            />
          ),
          renderThumb: (
            <button
              onClick={() => {
                setActiveStage(i);
                slideToItem(i);
              }}
              className={cl(
                styles.stageButton,
                i === activeStage ? styles.active : null,
              )}
            >
              {stages[i]}
            </button>
          ),
        })),
      }
    );

    return (
      <>
        <div ref={downloadImageRef} className={styles.fakeBracket}>
          {brackets.map((stage, i) => (
            <Stage
              key={i}
              stage={stage}
              isFinal={stage.length - 1 === i}
              isDoubles={isDoubles}
              matchesMap={matchesMap}
              playersMap={playersMap}
            />
          ))}
        </div>
        <div className={styles.stageButtons}>{thumbsFragment}</div>
        <div className={styles.carouselFragmentWrapper}>
          {carouselFragment}
        </div>
      </>
    );
  }
);

type StageProps = {
  stage: IBracketsUnit[];
  isDoubles: boolean;
  isFinal: boolean;
  matchesMap: Map<number, MatchT>;
  playersMap: Map<number, PlayerT>;
  isTouchStartNeeded?: boolean;
  onTouchStart?: (e: TouchEvent<HTMLDivElement>) => void;
  isTouchEndNeeded?: boolean;
  onTouchEnd?: (e: TouchEvent<HTMLDivElement>) => void;
};

const Stage = ({
  stage,
  isDoubles,
  matchesMap,
  playersMap,
  isFinal,
  isTouchStartNeeded,
  onTouchStart,
  isTouchEndNeeded,
  onTouchEnd,
}: StageProps) => (
  <div
    className={styles.stage}
    onTouchStart={isTouchStartNeeded ? onTouchStart : undefined}
    onTouchEnd={isTouchEndNeeded ? onTouchEnd : undefined}
  >
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
    <Link href={`/players/${p1.id}`}>
      <a>
        {(p1.first_name as string)[0]}. {p1.last_name}
      </a>
    </Link>
  ) : (
    <FaQuestion />
  );
  const p2Name = p2 ? (
    <Link href={`/players/${p2.id}`}>
      <a>
        {(p2.first_name as string)[0]}. {p2.last_name}
      </a>
    </Link>
  ) : (
    <FaQuestion />
  );
  const p3Name = p3 ? (
    <Link href={`/players/${p3.id}`}>
      <a>
        {(p3.first_name as string)[0]}. {p3.last_name}
      </a>
    </Link>
  ) : (
    <FaQuestion />
  );
  const p4Name = p4 ? (
    <Link href={`/players/${p4.id}`}>
      <a>
        {(p4.first_name as string)[0]}. {p4.last_name}
      </a>
    </Link>
  ) : (
    <FaQuestion />
  );

  const matchDateTime = match?.time ? new Date(match.time) : null;

  return (
    <div className={cl(styles.match, className)}>
      <div className={styles.row}>
        <div className={isDoubles ? styles.doublesCol : styles.col}>
          <div className={styles.singleNameWrapper}>
            {!isDoubles && !isValidElement(p1Name) && (
              <span className={styles.img}>
                {p1?.avatar?.includes('userapi.com') ? (
                  <Image
                    alt="player-image"
                    src={p1?.avatar || ''}
                    height={20}
                    width={20}
                  />
                ) : (
                  <BsFillPersonFill />
                )}
              </span>
            )}
            <span
              className={cl(
                isDoubles ? styles.doublesName : styles.name,
                isPlayed &&
                  parseInt(match?.winner_id as string, 10) === match?.player1_id
                  ? styles.winner
                  : ''
              )}
            >
              {p1Name} {isDoubles && `/`} {isDoubles && p3Name}
            </span>
          </div>
          <div className={styles.singleNameWrapper}>
            {!isDoubles && !isValidElement(p2Name) && (
              <span className={styles.img}>
                {p2?.avatar?.includes('userapi.com') ? (
                  <Image
                    alt="player-image"
                    src={p2?.avatar || ''}
                    height={20}
                    width={20}
                  />
                ) : (
                  <BsFillPersonFill />
                )}
              </span>
            )}
            {!isDoubles && <span>&nbsp;-&nbsp;</span>}
            <span
              className={cl(
                isDoubles ? styles.doublesName : styles.name,
                isPlayed &&
                  parseInt(match?.winner_id as string, 10) === match?.player2_id
                  ? styles.winner
                  : ''
              )}
            >
              {p2Name} {isDoubles && `/`} {isDoubles && p4Name}
            </span>
          </div>
        </div>

        <div className={styles.col}>
          {isPlayed ? (
            <span className={styles.score}>
              {match.score}
            </span>
          ) : (
            matchDateTime && (
              <span className={styles.matchDate}>
                <span className={styles.timeUnit}>
                  {format(matchDateTime, 'H:mm')}
                </span>
                  &nbsp;
                <span className={styles.timeUnit}>
                  {format(matchDateTime, 'dd.MM')}
                </span>
              </span>
            )
          )}
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

export default ScheduleTab;
