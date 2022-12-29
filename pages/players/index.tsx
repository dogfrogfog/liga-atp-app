import { ChangeEvent, useState } from 'react';
import type { NextPage } from 'next';
import axios from 'axios';
import { player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import SearchInput from 'components/SearchInput';
import PlayersList from 'components/PlayersList';
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
    <div className={styles.playersContainer}>
      <div className={styles.header}></div>
      {data.length === 0 ? (
        <NotFoundMessage message="Результаты по вашему запросу не найдены" />
      ) : (
        <>
          <p className={styles.listTitle}>Игроки</p>
          <PlayersList players={data} />
        </>
      )}
      <SearchInput
        value={search}
        handleChange={handleSearch}
        submitSearch={submitSearch}
      />
    </div>
  );
};

export const getServerSideProps = async () => {
  const players = await prisma.player.findMany({
    take: 15,
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
