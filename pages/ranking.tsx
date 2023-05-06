import { useState, useMemo, useEffect } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT, player_elo_ranking } from '@prisma/client';

import Tabs from 'ui-kit/Tabs';
import PageTitle from 'ui-kit/PageTitle';
import { PlayersList, PlayersListHeader } from 'components/PlayersList';
import styles from 'styles/Ranking.module.scss';
import { prisma } from 'services/db';
import { useRouter } from "next/router";
import { PlayerLevel } from "../constants/playerLevel";

const RANKING_TABS = [
  'На хайпе',
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
  const router = useRouter();
  const {level} = router.query

  useEffect(() => {
    switch (level) {
      case PlayerLevel.Hype:{
        setActiveTab(RANKING_TABS[0]);
        break;
      }
      case PlayerLevel.Pro:{
        setActiveTab(RANKING_TABS[1]);
        break;
      }
      case PlayerLevel.SuperMasters: {
        setActiveTab(RANKING_TABS[2]);
        break;
      }
      case PlayerLevel.Masters: {
        setActiveTab(RANKING_TABS[3]);
        break;
      }
      case PlayerLevel.Challenger: {
        setActiveTab(RANKING_TABS[4]);
        break;
      }
      case PlayerLevel.Legger: {
        setActiveTab(RANKING_TABS[5]);
        break;
      }
      case PlayerLevel.Futures: {
        setActiveTab(RANKING_TABS[6]);
        break;
      }
      case PlayerLevel.Satellite: {
        setActiveTab(RANKING_TABS[7]);
        break;
      }
    }
  }, [level])


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
        result = result.filter((p) => p.isHyped === true);
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
    switch (value) {
      case 0: {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Hype}})
        break;
      }
      case 1: {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Pro}})
        break;
      }
      case 2: {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.SuperMasters}})
        break;
      }
      case 3: {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Masters}})
        break;
      }
      case 4: {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Challenger}})
        break;
      }
      case 5: {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Legger}})
        break;
      }
      case 6: {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Futures}})
        break;
      }
      case 7: {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Satellite}})
        break;
      }
    }
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
      isHyped: true
    },
  });

  const playerEloRanking = await prisma.player_elo_ranking.findMany({
    select: {
      player_id: true,
      elo_points: true,
    },
    where: {
      expire_date: {
        gte: new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate()),
      },
    },
  });

  return {
    props: {
      players,
      playerEloRanking,
    },
    revalidate: 600,
  };
};

export default RankingPage;
