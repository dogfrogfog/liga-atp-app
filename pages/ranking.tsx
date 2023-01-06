import { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';

import Tabs from 'ui-kit/Tabs';
import { LEVEL_NUMBER_VALUES } from 'constants/values';
import PlayersList from 'components/PlayersList';
import { getPlayers } from 'services/players';
import styles from 'styles/Ranking.module.scss';

const RANKING_TABS = [
  'Все',

  // ...Object.values(LEVEL_NUMBER_VALUES),
  'Про',
  'Мастерс',
  'Леджер',
  'Челленджер',
  'Фьючерс',
  'Сателлит',
];

const RankingPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState(RANKING_TABS[0]);
  const [data, setData] = useState<PlayerT[]>([]);

  useEffect(() => {
    const fetchWrapper = async () => {
      const res = await getPlayers();

      if (res.isOk) {
        setData(res.data as PlayerT[]);
      }
    };

    fetchWrapper();
  }, []);

  const activeTabContent = (() => {
    let filteredPlayersList: PlayerT[];

    switch (activeTab) {
      case RANKING_TABS[0]: {
        filteredPlayersList = data;
        break;
      }
      case RANKING_TABS[1]: {
        filteredPlayersList = data.filter((p) => p.level === 3);
        break;
      }
      case RANKING_TABS[2]: {
        filteredPlayersList = data.filter((p) => p.level === 2);
        break;
      }
      case RANKING_TABS[3]: {
        filteredPlayersList = data.filter((p) => p.level === 4);
        break;
      }
      case RANKING_TABS[4]: {
        filteredPlayersList = data.filter((p) => p.level === 1);
        break;
      }
      case RANKING_TABS[5]: {
        filteredPlayersList = data.filter((p) => p.level === 0);
        break;
      }
      case RANKING_TABS[6]: {
        filteredPlayersList = data.filter((p) => p.level === -1);
        break;
      }
      default: {
        filteredPlayersList = [];
        break;
      }
    }

    return <PlayersList players={filteredPlayersList} shouldShowPlace />;
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
