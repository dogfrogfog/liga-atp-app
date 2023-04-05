import { useMemo, useState, ChangeEvent } from 'react';
import { player as PlayerT } from '@prisma/client';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

import { LEVEL_NUMBER_VALUES } from 'constants/values';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import { PlayersListHeader, PlayersList } from 'components/PlayersList';
import PageTitle from 'ui-kit/PageTitle';
import usePlayers from 'hooks/usePlayers';
import useEloPoints from 'hooks/useEloPoints';
import styles from 'styles/Players.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

const PlayersIndexPage: NextPage = () => {
  const router = useRouter();
  const { players, isLoading } = usePlayers();
  const [selectedLvl, setSelectedLvl] = useState('');
  const { eloPoints } = useEloPoints();

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
      eloPoints.reduce((acc, p) => {
        acc.set(p.player_id as number, p?.elo_points);
        return acc;
      }, new Map<number, number | null>()),
    [eloPoints]
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
            {Object.entries(LEVEL_NUMBER_VALUES).map(([key, name]) => (
              <option key={key} value={key}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </PageTitle>
      <PlayersListHeader />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <PlayersList players={filteredPlayers} />
      )}
    </div>
  );
};

export default PlayersIndexPage;
