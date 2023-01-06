import type { NextPage } from 'next';
import { player as PlayerT } from '@prisma/client';
import { useRouter } from 'next/router';

import { prisma } from 'services/db';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import PlayersList from 'components/PlayersList';
import PageTitle from 'ui-kit/PageTitle';
import styles from 'styles/Players.module.scss';

type PlayersIndexPageProps = {
  players: PlayerT[];
};

const PlayersIndexPage: NextPage<PlayersIndexPageProps> = ({ players }) => {
  const router = useRouter();

  const onSuggestionClick = (p: PlayerT) => {
    router.push(`/players/${p.id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.searchInputContainer}>
        <SuggestionsInput
          players={players}
          placeholder="Введите имя игрока"
          onSuggestionClick={onSuggestionClick}
        />
      </div>
      <PageTitle>Игроки</PageTitle>
      {players.length === 0 ? (
        <NotFoundMessage message="При загрузке игроков произошла ошибка. Попробуйте позже" />
      ) : (
        <PlayersList players={players} />
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const players = await prisma.player.findMany({
    take: 150,
    orderBy: {
      id: 'desc',
    },
  });

  return {
    props: {
      players,
    },
  };
};

export default PlayersIndexPage;
