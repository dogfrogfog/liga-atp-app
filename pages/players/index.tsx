import { useMemo, useState, ChangeEvent, useEffect, useCallback } from 'react';
import { player as PlayerT, player_elo_ranking } from '@prisma/client';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { prisma } from 'services/db';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import { PlayersListHeader, PlayersList } from 'components/PlayersList';
import PageTitle from 'ui-kit/PageTitle';
import styles from 'styles/Players.module.scss';
import { PlayerLevel } from "../../constants/playerLevel";

type PlayersPageProps = {
  players: PlayerT[];
  playerEloRanking: player_elo_ranking[];
};

const PlayersPage: NextPage<PlayersPageProps> = ({
  players,
  playerEloRanking,
}) => {
  const [selectedLvl, setSelectedLvl] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);
  const router = useRouter();
  const {level, position} = router.query;

  useEffect(() => {
    switch (level) {
      case PlayerLevel.Hype:{
       setSelectedLvl('');
        break;
      }
      case PlayerLevel.Pro:{
        setSelectedLvl('3');
        break;
      }
      case PlayerLevel.SuperMasters: {
        setSelectedLvl('5');
        break;
      }
      case PlayerLevel.Masters: {
        setSelectedLvl('2');
        break;
      }
      case PlayerLevel.Challenger: {
        setSelectedLvl('1');
        break;
      }
      case PlayerLevel.Legger: {
        setSelectedLvl('4');
        break;
      }
      case PlayerLevel.Futures: {
        setSelectedLvl('0');
        break;
      }
      case PlayerLevel.Satellite: {
        setSelectedLvl('-1');
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

  const onSuggestionClick = (p: PlayerT) => {
    router.push(`/players/${p.id}`);
  };

  const filterFn = (inputValue: string) => (p: PlayerT) =>
    ((p?.first_name as string) + ' ' + p?.last_name)
      .toLowerCase()
      .includes(inputValue);

  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLvl(e.target.value);
    switch (e.target.value) {
      case '': {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Hype}})
        break;
      }
      case '3': {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Pro}})
        break;
      }
      case '5': {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.SuperMasters}})
        break;
      }
      case '2': {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Masters}})
        break;
      }
      case '1': {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Challenger}})
        break;
      }
      case '4': {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Legger}})
        break;
      }
      case '0': {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Futures}})
        break;
      }
      case '-1': {
        router.push({ pathname: router.pathname, query: {level: PlayerLevel.Satellite}})
        break;
      }
    }
  };
  const handleScroll = useCallback((id: number) => {
    router.push({ pathname: router.pathname, query: {...router.query, position: window.scrollY}})
    router.push(`/players/${id}`);
  }, [level])

  const playersRankingsMap = useMemo(
    () =>
      playerEloRanking.reduce((acc, p) => {
        acc.set(p.player_id as number, p?.elo_points);
        return acc;
      }, new Map<number, number | null>()),
    [playerEloRanking]
  );

  const filteredPlayers = useMemo(() => {

    const filtered = selectedLvl
      ? players.filter((v) => v.level + '' === selectedLvl)
      : players.filter((v) => v.isHyped === true);

    return filtered
      .map((v) => ({ ...v, elo_points: playersRankingsMap.get(v.id) }))
      .sort((a, b) => (b.elo_points as number) - (a.elo_points as number));
  }, [selectedLvl, players, playersRankingsMap]);

  return (
    <div className={styles.pageContainer}>
      <div className={styles.searchInputContainer}>
        <SuggestionsInput
          suggestions={players}
          filterFn={filterFn}
          placeholder="Введите имя игрока"
          onSuggestionClick={onSuggestionClick}
        />
      </div>
      <PageTitle className={styles.titleWithFilter}>
        Игроки
        <div className={styles.lvlFilter}>
          <select onChange={handleLevelChange} value={selectedLvl}>
            <option value={''}>На хайпе</option>
            {[
              [3, 'Про'],
              [5, 'S-Мастерс'],
              [2, 'Мастерс'],
              [1, 'Челленджер'],
              [4, 'Леджер'],
              [0, 'Фьючерс'],
              [-1, 'Сателлит'],
            ].map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </PageTitle>
      <PlayersListHeader />
      <PlayersList players={filteredPlayers} handleScroll={handleScroll}/>
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

  // todo
  // if create relation between player and elo_points we dont need this call
  // we can extend select: {} of player.findMany and get this data in one query
  const playerEloRanking = await prisma.player_elo_ranking.findMany({
    select: {
      player_id: true,
      elo_points: true,
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

export default PlayersPage;
