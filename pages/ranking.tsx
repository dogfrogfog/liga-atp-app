import { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT, player_elo_ranking } from '@prisma/client';

import Tabs from 'ui-kit/Tabs';
import PageTitle from 'ui-kit/PageTitle';
import { PlayersList, PlayersListHeader } from 'components/PlayersList';
import styles from 'styles/Ranking.module.scss';
import { prisma } from 'services/db';

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

type RankingPageProps = {
  players: PlayerT[];
  playerEloRanking: Pick<player_elo_ranking, 'elo_points' | 'player_id'>[];
};

const RankingPage: NextPage<RankingPageProps> = ({
  players,
  playerEloRanking,
}) => {
  const [activeTab, setActiveTab] = useState(RANKING_TABS[0]);

  const playersMap = useMemo(
    () =>
      players.reduce((acc, p) => {
        acc.set(p.id, p);
        return acc;
      }, new Map<number, PlayerT>()),
    [players]
  );

  const filteredPlayers = (() => {
    let result = playerEloRanking
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
      <PlayersListHeader shouldShowPlace />
      <PlayersList players={filteredPlayers} shouldShowPlace />
    </div>
  );
};

export const getStaticProps = async () => {
  const players = await prisma.player.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      level: true,
      avatar: true,
    },
  });

  // todo
  // if create relation between player and elo_points we dont need this call
  // we can extend select: {} of player.findMany and get this data in one query
  const playerEloRanking = await prisma.player_elo_ranking.findMany({
    select: {
      player_id: true,
      elo_points: true,
    },
    where: {
      expire_date: {
        // even if we create new player elo ranking expire_date will be today and we will not see it in the response
        // 1 day ahead just in case of missing some time
        gt: new Date(new Date().getTime() - 1000 * 60 * 60 * 24),
      },
    },
  });

  return {
    props: {
      players,
      playerEloRanking,
    },
    revalidate: 600, // 10 min
  };
};

export default RankingPage;
