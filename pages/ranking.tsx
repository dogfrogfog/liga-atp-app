import { useState } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';

import Tabs from 'ui-kit/Tabs';
import PageTitle from 'ui-kit/PageTitle';
import { PlayersList, PlayersListHeader } from 'components/PlayersList';
import usePlayers from 'hooks/usePlayers';
import styles from 'styles/Ranking.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

const RANKING_TABS = [
  'Все',
  'Про', // 3
  'S-Мастерс', // 5
  'Мастерс', // 2
  'Челленджер', // 1
  'Леджер', // 4
  'Фьючерс', // 0
  'Сателлит', // -1
];

const RankingPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState(RANKING_TABS[0]);
  const { players, isLoading } = usePlayers();

  const filteredPlayers = (() => {
    let result: PlayerT[];

    switch (activeTab) {
      case RANKING_TABS[0]: {
        result = players;
        break;
      }
      case RANKING_TABS[1]: {
        result = players.filter((p) => p.level === 3);
        break;
      }
      case RANKING_TABS[2]: {
        result = players.filter((p) => p.level === 5);
        break;
      }
      case RANKING_TABS[3]: {
        result = players.filter((p) => p.level === 2);
        break;
      }
      case RANKING_TABS[4]: {
        result = players.filter((p) => p.level === 1);
        break;
      }
      case RANKING_TABS[5]: {
        result = players.filter((p) => p.level === 4);
        break;
      }
      case RANKING_TABS[6]: {
        result = players.filter((p) => p.level === 0);
        break;
      }
      case RANKING_TABS[7]: {
        result = players.filter((p) => p.level === -1);
        break;
      }
      default: {
        result = [];
        break;
      }
    }

    return result;
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(RANKING_TABS[value]);
  };

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Рейтинг</PageTitle>
      <Tabs
        tabNames={RANKING_TABS}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PlayersListHeader shouldShowPlace />
          <PlayersList players={filteredPlayers} shouldShowPlace />
        </>
      )}
    </div>
  );
};

export default RankingPage;
