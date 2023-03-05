import { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';

import Tabs from 'ui-kit/Tabs';
import PageTitle from 'ui-kit/PageTitle';
import { PlayersList, PlayersListHeader } from 'components/PlayersList';
import usePlayers from 'hooks/usePlayers';
import useActivePlayersRankings from 'hooks/useActivePlayersRankings';
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
  const { playersRankings, isLoading: isRankingLoading } =
    useActivePlayersRankings();

  const playersMap = useMemo(
    () =>
      players.reduce((acc, p) => {
        acc.set(p.id, p);
        return acc;
      }, new Map<number, PlayerT>()),
    [players]
  );

  const filteredPlayers = (() => {
    let result = playersRankings
      .map((v) => {
        const p = playersMap.get(v.player_id as number);

        if (p) {
          return {
            ...p,
            elo_points: v.elo_points,
          };
        }
      })
      .filter((v) => v)
      .sort(
        (a, b) => (b?.elo_points as number) - (a?.elo_points as number)
      ) as (PlayerT & { elo_points: number })[];

    switch (activeTab) {
      case RANKING_TABS[0]: {
        break;
      }
      case RANKING_TABS[1]: {
        result = result.filter((p) => p.level === 3);
        break;
      }
      case RANKING_TABS[2]: {
        result = result.filter((p) => p.level === 5);
        break;
      }
      case RANKING_TABS[3]: {
        result = result.filter((p) => p.level === 2);
        break;
      }
      case RANKING_TABS[4]: {
        result = result.filter((p) => p.level === 1);
        break;
      }
      case RANKING_TABS[5]: {
        result = result.filter((p) => p.level === 4);
        break;
      }
      case RANKING_TABS[6]: {
        result = result.filter((p) => p.level === 0);
        break;
      }
      case RANKING_TABS[7]: {
        result = result.filter((p) => p.level === -1);
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
      <PageTitle>Эло</PageTitle>
      <Tabs
        tabNames={RANKING_TABS}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
      {isLoading || isRankingLoading ? (
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
