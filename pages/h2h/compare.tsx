import { useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import type { player as PlayerT } from '@prisma/client';
import cl from 'classnames';
import { format } from 'date-fns';

import { prisma } from 'services/db';
import Tabs from 'ui-kit/Tabs';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import StatsTab from 'components/statsTabs/Stats';
import SpecsTab from 'components/statsTabs/Specs';
import MatchListElement from 'components/MatchListElement';
import { getOpponents, MatchWithTournamentType } from 'utils/getOpponents';
import { calculateMatchesForP1Score } from 'utils/calculateMatchesScore';
import { LEVEL_NUMBER_VALUES } from 'constants/values';
import styles from 'styles/Compare.module.scss';

const STATS_TABS = ['Статистика', 'Характеристика', 'Матчи'];

const CompareTwoPlayersPage: NextPage<{
  p1: PlayerT;
  p2: PlayerT;
  matches: MatchWithTournamentType[];
}> = ({ p1, p2, matches }) => {
  const [activeTab, setActiveTab] = useState(STATS_TABS[0]);

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(STATS_TABS[value]);
  };

  const activeTabContent = (() => {
    switch (activeTab) {
      case STATS_TABS[0]: {
        return <StatsTab />;
      }
      case STATS_TABS[1]: {
        return (
          <SpecsTab
            technique={[p1.technique, p2.technique]}
            tactics={[p1.tactics, p2.tactics]}
            power={[p1.power as number, p2.power as number]}
            shakes={[p1.shakes, p2.shakes]}
            serve={[p1.serve, p2.serve]}
            behaviour={[p1.behaviour, p2.behaviour]}
          />
        );
      }
      case STATS_TABS[2]: {
        return (
          <>
            {matches.length > 0 ? (
              matches.map((match, i) => (
                <MatchListElement
                  key={i}
                  tournamentName={match.tournament.name || ''}
                  startDate={
                    match?.start_date
                      ? format(new Date(match.start_date), 'yyyy-MM-dd')
                      : ''
                  }
                  score={match?.score || ''}
                  p1Name={(p1.first_name as string)[0] + '. ' + p1.last_name}
                  p2Name={getOpponents(p1.id, match)}
                  isMainPlayerWin={String(p1.id) === match?.winner_id}
                />
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
        {/* add styles for actual image */}
        <div className={cl(styles.img, styles.side)}></div>
        {/* add styles for actual image */}
        <div className={cl(styles.img, styles.side)}></div>
      </div>
      {matches.length > 0 && (
        <div className={styles.score}>
          {calculateMatchesForP1Score(matches)}
        </div>
      )}
      <div className={styles.mainInfo}>
        <div className={cl(styles.playerInfo, styles.side)}>
          <p className={styles.name}>
            {p1.first_name} {p1.last_name}
          </p>
          <div className={styles.info}>
            <span className={styles.lvl}>
              {LEVEL_NUMBER_VALUES[p1.level as number]}
            </span>
            {/* <span className={styles.top}>{'<318>'}</span> */}
            <span className={styles.rank}>1434</span>
          </div>
        </div>
        <div className={cl(styles.playerInfo, styles.side)}>
          <p className={styles.name}>
            {p2.first_name} {p2.last_name}
          </p>
          <div className={styles.info}>
            <span className={styles.lvl}>
              {LEVEL_NUMBER_VALUES[p2.level as number]}
            </span>
            {/* <span className={styles.top}>{'<39>'}</span> */}
            <span className={styles.rank}>188</span>
          </div>
        </div>
      </div>
      <div className={styles.tabsContainer}>
        <Tabs
          activeTab={activeTab}
          onChange={handleTabChange}
          tabNames={STATS_TABS}
        />
        <div className={styles.tabContentWrapper}>{activeTabContent}</div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const { p1Id, p2Id } = ctx.query;
  const p1IdInt = parseInt(p1Id as string, 10);
  const p2IdInt = parseInt(p2Id as string, 10);

  const p1 = await prisma.player.findUnique({
    where: {
      id: p1IdInt,
    },
  });

  const p2 = await prisma.player.findUnique({
    where: {
      id: p2IdInt,
    },
  });

  // matches of two selected players
  const matches = await prisma.match.findMany({
    where: {
      OR: [
        { player1_id: p1IdInt, player2_id: p2IdInt },
        { player1_id: p2IdInt, player2_id: p1IdInt },
      ],
    },
    include: {
      tournament: true,
      player_match_player1_idToplayer: true,
      player_match_player2_idToplayer: true,
      player_match_player3_idToplayer: true,
      player_match_player4_idToplayer: true,
    },
  });

  return {
    props: {
      p1,
      p2,
      matches,
    },
  };
};

export default CompareTwoPlayersPage;
