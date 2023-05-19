import { useCallback, useEffect, useMemo, useState } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT, player_elo_ranking } from '@prisma/client';

import Tabs from 'ui-kit/Tabs';
import PageTitle from 'ui-kit/PageTitle';
import { PlayersList, PlayersListHeader } from 'components/PlayersList';
import styles from 'styles/Ranking.module.scss';
import { prisma } from 'services/db';
import { useRouter } from "next/router";
import { PlayerLevel } from "../constants/playerLevel";
import { setPlayersLevelToQuery } from "../utils/setPlayersLevelToQuery";

const RANKING_TABS = [
  'На хайпе',//0
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
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();
  const {level, position} = router.query

  useEffect(() => {
    switch (level as PlayerLevel) {
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
  useEffect(() => {
    if (position) {
      setScrollPosition(+position);
    }
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);


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

  const handleTabChange = async (_: any, value: number) => {
    setActiveTab(RANKING_TABS[value]);
    switch (value) {
      case 0: {
        await setPlayersLevelToQuery(PlayerLevel.Hype, router);
        break;
      }
      case 1: {
        await setPlayersLevelToQuery(PlayerLevel.Pro, router);
        break;
      }
      case 2: {
        await setPlayersLevelToQuery(PlayerLevel.SuperMasters, router);
        break;
      }
      case 3: {
        await setPlayersLevelToQuery(PlayerLevel.Masters, router);
        break;
      }
      case 4: {
        await setPlayersLevelToQuery(PlayerLevel.Challenger, router);
        break;
      }
      case 5: {
        await setPlayersLevelToQuery(PlayerLevel.Legger, router);
        break;
      }
      case 6: {
        await setPlayersLevelToQuery(PlayerLevel.Futures, router);
        break;
      }
      case 7: {
        await setPlayersLevelToQuery(PlayerLevel.Satellite, router);
        break;
      }
    }
  };

  const handleScroll = useCallback(async (id: number) => {
    await router.push({ pathname: router.pathname, query: {...router.query, position: window.scrollY}});
    await router.push(`/players/${id}`);
  }, [level])

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Эло</PageTitle>
      <Tabs
        tabNames={RANKING_TABS}
        activeTab={activeTab}
        onChange={handleTabChange}
      />
      <PlayersListHeader shouldShowPlace />
      <PlayersList players={filteredPlayers} handleScroll={handleScroll} shouldShowPlace />
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
