import cl from 'classnames';
import { match as MatchT, player as PlayerT } from '@prisma/client';
import { format } from 'date-fns';
import { useSpringCarousel } from 'react-spring-carousel';

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

  const { carouselFragment, thumbsFragment, slideToItem, getIsActiveItem } =
    useSpringCarousel({
      withThumbs: true,
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
          <button onClick={() => slideToItem(i)} className={styles.stageButton}>
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
            {bracketUnit.length > 0
              ? bracketUnit.map((v, gmi) => (
                  <Match
                    key={gmi}
                    isFinal={isFinal}
                    isDoubles={isDoubles}
                    match={matchesMap.get(v.matchId)}
                    playersMap={playersMap}
                  />
                ))
              : 'В группе пока нет матчей'}
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
          tbd / tbd
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
}: {
  isFinal: boolean;
  isDoubles: boolean;
  match?: MatchT;
  playersMap: Map<number, PlayerT>;
}) => {
  const isPlayed = match?.winner_id && match.score;
  const p1 = match?.player1_id ? playersMap.get(match.player1_id) : undefined;
  const p2 = match?.player2_id ? playersMap.get(match.player2_id) : undefined;
  const p3 = match?.player3_id ? playersMap.get(match.player3_id) : undefined;
  const p4 = match?.player4_id ? playersMap.get(match.player4_id) : undefined;

  // @ts-ignore
  const p1Name = p1 ? `${p1.first_name[0]}. ${p1.last_name}` : 'tbd1';
  // @ts-ignore
  const p2Name = p2 ? `${p2.first_name[0]}. ${p2.last_name}` : 'tbd';
  // @ts-ignore
  const p3Name = p3 ? `${p3.first_name[0]}. ${p3.last_name}` : 'tbd';
  // @ts-ignore
  const p4Name = p4 ? `${p4.first_name[0]}. ${p4.last_name}` : 'tbd';

  const nameString1 = isDoubles ? `${p1Name} / ${p3Name}` : p1Name;
  const nameString2 = isDoubles ? `${p2Name} / ${p4Name}` : p2Name;

  return (
    <div className={styles.match}>
      <div className={styles.row}>
        <div className={styles.left}>
          <span className={styles.img}>{/* <Image src={iconSrc} /> */}</span>
          <span
            className={cl(
              styles.name,
              isPlayed &&
                parseInt(match?.winner_id as string, 10) === match?.player1_id
                ? styles.winner
                : ''
            )}
          >
            {nameString1 || 'tbd'}
          </span>
        </div>
        <div className={styles.right}>
          <span className={styles.date}>
            {isPlayed ? match.score : ''}
            {!isPlayed && match?.start_date
              ? format(new Date(match.start_date), 'dd.MM-HH:mm')
              : ''}
          </span>
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.left}>
          <span className={styles.img}>{/* <Image src={iconSrc} /> */}</span>
          <span
            className={cl(
              styles.name,
              isPlayed &&
                parseInt(match?.winner_id as string, 10) === match?.player2_id
                ? styles.winner
                : ''
            )}
          >
            {nameString2 || 'tbd'}
          </span>
        </div>
        <div className={styles.right}>
          <span className={styles.place}>{!isPlayed ? '<место>' : ''}</span>
        </div>
      </div>
      {isFinal ? 'isFinal' : ''}
    </div>
  );
};

export default ScheculeTab;
