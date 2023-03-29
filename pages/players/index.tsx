import { useEffect, useState, ChangeEvent } from 'react';
import { player as PlayerT } from '@prisma/client';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

import { LEVEL_NUMBER_VALUES } from 'constants/values';
import { getShuffledPlayersWithEloPoints } from 'services/players';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import { PlayersListHeader, PlayersList } from 'components/PlayersList';
import PageTitle from 'ui-kit/PageTitle';
import usePlayers from 'hooks/usePlayers';
import styles from 'styles/Players.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

const PlayersIndexPage: NextPage = () => {
  const router = useRouter();
  const { players } = usePlayers();
  const [selectedLvl, setSelectedLvl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shuffledPlayers, setShuffledPlayers] = useState<
    (PlayerT & { elo_points: number })[]
  >([]);

  useEffect(() => {
    const fetchShuffledPlayers = async () => {
      setIsLoading(true);
      const res = await getShuffledPlayersWithEloPoints();

      if (res.isOk) {
        setShuffledPlayers(res.data as (PlayerT & { elo_points: number })[]);
      }
      setIsLoading(false);
    };

    fetchShuffledPlayers();
  }, []);

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

  const filteredPlayers = selectedLvl
    ? shuffledPlayers.filter((v) => v.level + '' === selectedLvl)
    : shuffledPlayers;

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
