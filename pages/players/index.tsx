import {
  useEffect,
  useState,
  memo,
  Dispatch,
  SetStateAction,
  useMemo,
} from 'react';
import { player as PlayerT } from '@prisma/client';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

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
  const [isLoading, setIsLoading] = useState(true);
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
      <PageTitle>Игроки</PageTitle>
      <PlayersListHeader />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <PlayersList players={shuffledPlayers} />
      )}
    </div>
  );
};

export default PlayersIndexPage;
