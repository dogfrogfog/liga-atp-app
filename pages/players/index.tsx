import { ChangeEvent, useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import axios from 'axios';
import { BsFillPersonFill } from 'react-icons/bs';
import { PrismaClient, player as PlayerT } from '@prisma/client';

import NotFoundMessage from 'ui-kit/NotFoundMessage';
import { LEVEL_NUMBER_VALUES } from 'constants/values';
import SearchInput from 'components/SearchInput';
import styles from 'styles/Players.module.scss';

type PlayersPageProps = {
  players: PlayerT[];
};

const Players: NextPage<PlayersPageProps> = ({ players }) => {
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
          <div className={styles.playersTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <td>Игрок</td>
                  <td>Уровень</td>
                  <td>Рейтинг</td>
                </tr>
              </thead>
              <tbody>
                {data.map(({ id, first_name, last_name, level, avatar }) => (
                  <Link key={id} href={'/players/' + id}>
                    <tr key={id}>
                      <td>
                        <div className={styles.playerRow}>
                          <div className={styles.image}>
                            {avatar ? null : <BsFillPersonFill />}
                          </div>
                          <span>{`${(
                            first_name as string
                          )[0].toUpperCase()}. ${last_name}`}</span>
                        </div>
                      </td>
                      <td>{LEVEL_NUMBER_VALUES[level as number]}</td>
                      <td>1489</td>
                    </tr>
                  </Link>
                ))}
              </tbody>
            </table>
          </div>
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
  const prisma = new PrismaClient();

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

export default Players;
