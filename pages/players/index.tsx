import type { NextPage } from 'next';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

import { PrismaClient } from '@prisma/client';

import Input from 'ui-kit/Input';
import { LEVEL_NUMBER_VALUES } from 'constants/values';
import styles from 'styles/Players.module.scss';
import { FiMenu, FiSearch } from 'react-icons/fi';
import { BsFillPersonFill } from 'react-icons/bs';
import NotFoundMessage from '../../ui-kit/NotFoundMessage';

// should be nested from schema
interface PlayersPageProps {
  players: any[];
}

const Players: NextPage<PlayersPageProps> = ({ players }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(players);
  const [isOpen, setIsOpen] = useState(false);

  if (data.length > 0) {
    console.log(data);
  }

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
      <div className={styles.header}>LIGA TENNISA APP</div>
      {!isOpen && (
        <div className={styles.search}>
          <button onClick={submitSearch} className={styles.searchButton}>
            <FiSearch />
          </button>
          <Input
            placeholder="Введите имя игрока"
            value={search}
            onChange={handleSearch}
          />
          <button
            onClick={() => setIsOpen(true)}
            className={styles.filterButton}
          >
            <FiMenu />
          </button>
        </div>
      )}
      {isOpen && (
        <div className={styles.popupContainer}>
          <button
            onClick={() => setIsOpen(false)}
            className={styles.filterButton}
          >
            <FiMenu />
          </button>
          <ul>
            <p>Фильтр по категориям</p>
            {[
              'Топ 10 игроков Лиги',
              'Рейтинг ЭЛО',
              'Количество сыгранных матчей',
              'Процент выигранных тай-брейков',
              'Среднее число ударов',
            ].map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      )}
      {data.length === 0 ? (
        <NotFoundMessage message="Результаты по вашему запросу не найдены" />
      ) : (
        <>
          <p className={styles.listTitle}>Игроки лиги</p>
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
                {data.map(
                  ({ id, first_name, last_name, level, avatar }) => (
                    <Link key={id} href={'/players/' + id}>
                      <tr key={id}>
                        <td>
                          <div className={styles.playerRow}>
                            <div className={styles.image}>
                              {avatar ? (
                                <Image
                                  width={40}
                                  height={40}
                                  src={avatar}
                                  alt={first_name + ' ' + last_name}
                                />
                              ) : (
                                <BsFillPersonFill />
                              )}
                            </div>
                            <span>{last_name + ` ${first_name[0]}.`}</span>
                          </div>
                        </td>
                        <td>{LEVEL_NUMBER_VALUES[level]}</td>
                        <td>1489</td>
                      </tr>
                    </Link>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
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
