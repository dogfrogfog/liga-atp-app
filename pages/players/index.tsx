import { useState, memo, Dispatch, SetStateAction, useMemo } from 'react';
import { player as PlayerT } from '@prisma/client';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';

import { PLAYERS_PAGE_SIZE } from 'constants/values';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import { PlayersListHeader, PlayersList } from 'components/PlayersList';
import PageTitle from 'ui-kit/PageTitle';
import usePlayers from 'hooks/usePlayers';
import useEloPoints from 'hooks/useEloPoints';
import styles from 'styles/Players.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

const PlayersIndexPage: NextPage = () => {
  const router = useRouter();
  const { players } = usePlayers();
  const { eloPoints } = useEloPoints();
  const [playersPageNumber, setPlayersPageNumber] = useState(1);

  const playersRankingsMap = useMemo(
    () =>
      eloPoints.reduce((acc, p) => {
        acc.set(p.player_id as number, p?.elo_points);
        return acc;
      }, new Map<number, number | null>()),
    [eloPoints]
  );

  const onSuggestionClick = (p: PlayerT) => {
    router.push(`/players/${p.id}`);
  };

  const filterFn = (inputValue: string) => (p: PlayerT) =>
    ((p?.first_name as string) + ' ' + p?.last_name)
      .toLowerCase()
      .includes(inputValue);

  const pages = (() => {
    const result = [];
    for (let i = 0; i < playersPageNumber; i += 1) {
      result.push(
        <PaginatedPlayersList
          key={i}
          pageNumber={i + 1}
          isLastPage={i + 1 === playersPageNumber}
          setPlayersPageNumber={setPlayersPageNumber}
          playersRankingsMap={playersRankingsMap}
        />
      );
    }

    return result;
  })();

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
      {pages}
    </div>
  );
};

const PaginatedPlayersList = memo(
  ({
    pageNumber,
    isLastPage,
    setPlayersPageNumber,
    playersRankingsMap,
  }: {
    pageNumber: number;
    isLastPage: boolean;
    setPlayersPageNumber: Dispatch<SetStateAction<number>>;
    playersRankingsMap: Map<number, number | null>;
  }) => {
    const { players, isLoading } = usePlayers(pageNumber);

    if (isLastPage && isLoading) {
      return <LoadingSpinner />;
    }

    const playersWithElo = players.map((v) => ({
      ...v,
      elo_points: playersRankingsMap.get(v.id as number) as number,
    }));

    return (
      <>
        <PlayersList players={playersWithElo} />
        {isLastPage && players.length === PLAYERS_PAGE_SIZE && (
          <div className={styles.loadMoreContainer}>
            <button
              onClick={() => setPlayersPageNumber((v) => v + 1)}
              className={styles.loadMore}
            >
              Загрузить еще
            </button>
          </div>
        )}
      </>
    );
  }
);

export default PlayersIndexPage;
