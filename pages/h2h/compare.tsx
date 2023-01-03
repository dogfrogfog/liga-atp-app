import { useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import type { player as PlayerT } from '@prisma/client';
import cl from 'classnames';

import { prisma } from 'services/db';
import Tabs from 'ui-kit/Tabs';
import StatsTab from 'components/statsTabs/Stats';
import SpecsTab from 'components/statsTabs/Specs';
import MatchesTab from 'components/statsTabs/Matches';
import styles from 'styles/Compare.module.scss';

const STATS_TABS = ['Статистика', 'Характеристика', 'Матчи'];

const CompareTwoPlayersPage: NextPage<{ p1: PlayerT; p2: PlayerT }> = ({
  p1,
  p2,
}) => {
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
            technique={[10, 30]}
            tactics={[10, 30]}
            power={[10, 30]}
            shakes={[10, 30]}
            serve={[10, 30]}
            behaviour={[10, 30]}
          />
        );
      }
      case STATS_TABS[2]: {
        return <MatchesTab />;
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
      <div className={styles.score}>8 VS 11</div>
      <div className={styles.mainInfo}>
        <div className={cl(styles.playerInfo, styles.side)}>
          <p className={styles.name}>Иван Пирогов</p>
          <div className={styles.info}>
            <span className={styles.lvl}>Мастерс</span>
            <span className={styles.top}>11</span>
            <span className={styles.rank}>1434</span>
          </div>
        </div>
        <div className={cl(styles.playerInfo, styles.side)}>
          <p className={styles.name}>Иван Пирогов</p>
          <div className={styles.info}>
            <span className={styles.lvl}>Мастерс</span>
            <span className={styles.top}>11</span>
            <span className={styles.rank}>1434</span>
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

  const p1 = await prisma.player.findUnique({
    where: {
      id: parseInt(p1Id as string, 10),
    },
  });

  const p2 = await prisma.player.findUnique({
    where: {
      id: parseInt(p2Id as string, 10),
    },
  });

  return {
    props: {
      p1,
      p2,
    },
  };
};

export default CompareTwoPlayersPage;
