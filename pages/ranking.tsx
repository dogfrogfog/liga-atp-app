import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';

import Tabs from 'ui-kit/Tabs';
import PlayersList from 'components/PlayersList';
import { getPlayers } from 'services/players';
import styles from 'styles/Ranking.module.scss';

const RANKING_TABS = [
  'Все',
  'Про',
  'Мастерс',
  'Леджер',
  'Челленджер',
  'Фьючерс',
  'Сателлит',
];

const RankingPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState(RANKING_TABS[0]);
  // const [data, setData] = useState<PlayerT[]>([]);

  // useEffect(() => {
  //   const fetchWrapper = async () => {
  //     const res = await getPlayers({ pa });

  //     if (res.isOk) {
  //       setData(res.data as PlayerT[]);
  //       setLoadingStatus(false);
  //     }
  //   };

  //   fetchWrapper();
  // }, [pagination]);

  const activeTabContent = (() => {
    return null;
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(RANKING_TABS[value]);
  };

  return (
    <div className={styles.container}>
      <p className={styles.pageTitle}>Рейтинг</p>
      <Tabs
        tabNames={RANKING_TABS}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
      {activeTabContent}
    </div>
  );
};

export default RankingPage;
