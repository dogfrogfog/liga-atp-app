import { useMemo, useState, ChangeEvent } from 'react';
import { player as PlayerT, player_elo_ranking } from '@prisma/client';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import { prisma } from 'services/db';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import { PlayersListHeader, PlayersList } from 'components/PlayersList';
import PageTitle from 'ui-kit/PageTitle';
import styles from 'styles/Players.module.scss';

type PlayersPageProps = {
  players: PlayerT[];
  playerEloRanking: player_elo_ranking[];
};

const PlayersPage: NextPage<PlayersPageProps> = ({
  players,
  playerEloRanking,
}) => {
  const router = useRouter();
  const [selectedLvl, setSelectedLvl] = useState('');

  const onSuggestionClick = (p: PlayerT) => {
    router.push(`/players/${p.id}`);
  };

  const filterFn = (inputValue: string) => (p: PlayerT) =>
    ((p?.first_name as string) + ' ' + p?.last_name)
      .toLowerCase()
      .includes(inputValue);

  const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLvl(e.target.value);
  };

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
      : players;

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
            <option value={''}>Все</option>
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
      <PlayersList players={filteredPlayers} />
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
  });

  return {
    props: {
      players,
      playerEloRanking,
    },
    revalidate: 60, // 1 min
  };
};

export default PlayersPage;
