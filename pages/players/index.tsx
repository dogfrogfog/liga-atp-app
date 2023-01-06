import { ChangeEvent, useState } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import SearchInput from 'components/SearchInput';
import PlayersList from 'components/PlayersList';
import PageTitle from 'ui-kit/PageTitle';
import styles from 'styles/Players.module.scss';

type PlayersIndexPageProps = {
  players: PlayerT[];
};

const PlayersIndexPage: NextPage<PlayersIndexPageProps> = ({ players }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(players);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const submitSearch = async () => {
    const response = await axios.get(`/api/players/search?name=${search}`);

    if (response.status === 200) {
      setData(response.data);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.searchInputContainer}>
        <SearchInput
          value={search}
          handleChange={handleSearch}
          submitSearch={submitSearch}
        />
      </div>
      <PageTitle>Игроки</PageTitle>
      {data.length === 0 ? (
        <NotFoundMessage message="При загрузке игроков произошла ошибка. Попробуйте позже" />
      ) : (
        <>
          <PlayersList players={data} />
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const players = await prisma.player.findMany({
    take: 50,
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
