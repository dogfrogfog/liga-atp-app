import { useState, useMemo } from 'react';
import type { NextPage, NextPageContext } from 'next';
import type { player as PlayerT } from '@prisma/client';
import cl from 'classnames';
import Link from 'next/link';

import { prisma } from 'services/db';
import Tabs from 'ui-kit/Tabs';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import StatsTab from 'components/Stats';
import SpecsTab from 'components/statsTabs/Specs';
import MatchListElement from 'components/MatchListElement';
import { MatchWithTournamentType } from 'utils/getOpponents';
import {
  LEVEL_NUMBER_VALUES,
  DOUBLES_TOURNAMENT_TYPES_NUMBER,
  DEFAULT_PROFILE_IMAGE
} from 'constants/values';
import useStats from 'hooks/useStats';
import useMatches from 'hooks/useMatches';
import calculateYearsFromDate from 'utils/calculateYearsFromDate';
import removeMatchesDuplicates from 'utils/removeMatchesDuplicates';
import styles from 'styles/Compare.module.scss';

const STATS_TABS = ['Статистика', 'Характеристика', 'Матчи'];

type PlayerWithEloPoints = PlayerT & { elo_points: number };

const CompareTwoPlayersPage: NextPage<{
  p1?: PlayerWithEloPoints;
  p2?: PlayerWithEloPoints;
}> = ({ p1, p2 }) => {
  const [activeTab, setActiveTab] = useState(STATS_TABS[0]);

  const { statsData: p1StatsData } = useStats(p1?.id);
  const { statsData: p2StatsData } = useStats(p2?.id);
  const { matches: p1Matches } = useMatches(p1?.id as number);
  const { matches: p2Matches } = useMatches(p2?.id as number);

  // @ts-ignore
  const { playersMatches, p1Wins, p2Wins } = useMemo(
    () =>
      p1 && p2
        ? removeMatchesDuplicates([...p1Matches, ...p2Matches]).reduce(
            (acc, m) => {
              // count only singles
              const isDoubles =
                !!(
                  (m.player3_id && m.player4_id) ||
                  DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
                    m.tournament.tournament_type as number
                  )
                ) ||
                (m.tournament.status === null &&
                  (m.winner_id as string)?.length > 4);

              const isBothPlayersInMatch =
                (m.player1_id === p1.id && m.player2_id === p2.id) ||
                (m.player1_id === p2.id && m.player2_id === p1.id);

              if (!isDoubles && isBothPlayersInMatch) {
                acc.playersMatches.push(m);

                if (
                  m.winner_id === p1.id + '' &&
                  !m.score?.toLowerCase().includes('w/o') &&
                  !m.comment?.toLowerCase().includes('w/o')
                ) {
                  acc.p1Wins += 1;
                }

                if (
                  m.winner_id === p2.id + '' &&
                  !m.score?.toLowerCase().includes('w/o') &&
                  !m.comment?.toLowerCase().includes('w/o')
                ) {
                  acc.p2Wins += 1;
                }
              }

              return acc;
            },
            {
              playersMatches: [] as MatchWithTournamentType[],
              p1Wins: 0,
              p2Wins: 0,
            }
          )
        : {
            playersMatches: [] as MatchWithTournamentType[],
            p1Wins: 0,
            p2Wins: 0,
          },
    [p1Matches, p2Matches, p1, p2]
  );

  if (!p1 || !p2) {
    return (
      <div className={styles.errorContainer}>
        <NotFoundMessage
          className={styles.notFound}
          message="Выберите двух игроков"
        />
      </div>
    );
  }

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(STATS_TABS[value]);
  };

  const activeTabContent = (() => {
    switch (activeTab) {
      case STATS_TABS[0]: {
        return (
          <div className={styles.tabContentWrapper}>
            <StatsTab
              p1Stats={p1StatsData as any}
              p2Stats={p2StatsData as any}
              p1Years={
                p1.in_tennis_from
                  ? calculateYearsFromDate(p1.in_tennis_from) + ''
                  : ''
              }
              p2Years={
                p2.in_tennis_from
                  ? calculateYearsFromDate(p2.in_tennis_from) + ''
                  : ''
              }
            />
          </div>
        );
      }
      case STATS_TABS[1]: {
        return (
          <div className={styles.tabContentWrapper}>
            <SpecsTab
              power={[p1.power as number, p2.power as number]}
              technique={[p1.technique, p2.technique]}
              net_game={[p1.net_game, p2.net_game]}
              serve={[p1.serve, p2.serve]}
              psychology={[p1.psychology, p2.psychology]}
              behavior={[p1.behavior, p2.behavior]}
            />
          </div>
        );
      }
      case STATS_TABS[2]: {
        return (
          <>
            {playersMatches && playersMatches.length > 0 ? (
              // @ts-ignore
              playersMatches.map((match, i) => (
                <MatchListElement key={i} match={match} />
              ))
            ) : (
              <NotFoundMessage
                className={styles.err}
                message="У игроков еще нет совместных матчей"
              />
            )}
          </>
        );
      }
      default:
        return null;
    }
  })();

  return (
    <div className={styles.container}>
      <div className={styles.images}>
        <div
          className={cl(styles.img, styles.side)}
          style={{
            background: `url(${p1.avatar || DEFAULT_PROFILE_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPositionX: 'center',
          }}
        ></div>
        <div
          className={cl(styles.img, styles.side)}
          style={{
            background: `url(${p2.avatar || DEFAULT_PROFILE_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPositionX: 'center',
          }}
        ></div>
      </div>
      <div className={styles.score}>
        {p1Wins} vs {p2Wins}
      </div>
      <div className={styles.mainInfo}>
        <div className={cl(styles.playerInfo, styles.side)}>
          <p className={styles.name}>
            <Link href={`/players/${p1.id}`}>
              <a>
                {p1.first_name}
                <br />
                {p1.last_name}
              </a>
            </Link>
          </p>
          <div className={styles.info}>
            <span className={styles.lvl}>
              {LEVEL_NUMBER_VALUES[p1.level as number]}
            </span>
            <span className={styles.rank}>{p1?.elo_points}</span>
          </div>
        </div>
        <div className={cl(styles.playerInfo, styles.side)}>
          <p className={styles.name}>
            <Link href={`/players/${p2.id}`}>
              <a>
                {p2.first_name}
                <br />
                {p2.last_name}
              </a>
            </Link>
          </p>
          <div className={styles.info}>
            <span className={styles.lvl}>
              {LEVEL_NUMBER_VALUES[p2.level as number]}
            </span>
            <span className={styles.rank}>{p2?.elo_points}</span>
          </div>
        </div>
      </div>
      <div className={styles.tabsContainer}>
        <Tabs
          activeTab={activeTab}
          onChange={handleTabChange}
          tabNames={STATS_TABS}
        />
        {activeTabContent}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { p1Id, p2Id } = ctx.query;
  const p1IdInt = parseInt(p1Id as string, 10);
  const p2IdInt = parseInt(p2Id as string, 10);

  let p1;
  if (p1IdInt) {
    // @ts-ignore
    const [p1Data, { elo_points }] = await prisma.$transaction([
      prisma.player.findUnique({
        where: {
          id: p1IdInt,
        },
      }),
      prisma.player_elo_ranking.findUnique({
        where: {
          player_id: p1IdInt,
        },
      }),
    ]);

    p1 = { ...p1Data, elo_points };
  }

  let p2;
  if (p2IdInt) {
    // @ts-ignore
    const [p2Data, { elo_points }] = await prisma.$transaction([
      prisma.player.findUnique({
        where: {
          id: p2IdInt,
        },
      }),
      prisma.player_elo_ranking.findUnique({
        where: {
          player_id: p2IdInt,
        },
      }),
    ]);

    p2 = { ...p2Data, elo_points };
  }

  return {
    props: {
      p1,
      p2,
    },
  };
};

export default CompareTwoPlayersPage;
