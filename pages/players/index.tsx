import type { NextPage } from 'next';
import { player as PlayerT } from '@prisma/client';
import { useRouter } from 'next/router';

import NotFoundMessage from 'ui-kit/NotFoundMessage';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import PlayersList from 'components/PlayersList';
import PageTitle from 'ui-kit/PageTitle';
import usePlayers from 'hooks/usePlayers';
import styles from 'styles/Players.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

const PlayersIndexPage: NextPage = () => {
  const router = useRouter();
  const { players, isLoading, error } = usePlayers();

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
      {error && (
        <NotFoundMessage message="При загрузке игроков произошла ошибка. Попробуйте позже" />
      )}
      {isLoading ? <LoadingSpinner /> : <PlayersList players={players} />}
    </div>
  );
};

export default PlayersIndexPage;
