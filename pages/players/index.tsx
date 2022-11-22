import type { NextPage } from 'next'
import Image from 'next/image'
import { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import ligaLogo from '../../public/180x180.png'

import { PrismaClient } from '@prisma/client'

import Input from 'ui-kit/Input';
import { LEVEL_NUMBER_VALUES } from 'constants/values';
import styles from 'styles/Players.module.scss';

// should be nested from schema
interface PlayersPageProps {
  players: any[];
}

const noAvatarIcon =
  <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="21" cy="21" r="20.5" stroke="white"/>
    <path d="M17.3844 17.5645H24.6479C28.3385 17.5645 31.4806 20.2494 32.0562 23.8948L32.5935 27.2982C33.0248 30.0295 30.9138 32.5 28.1486 32.5H13.8717C11.1003 32.5 8.98764 30.019 9.42924 27.283L9.98019 23.8695C10.5667 20.2357 13.7035 17.5645 17.3844 17.5645Z" fill="#C6C6C6" stroke="white"/>
    <path d="M27 14.129C27 17.8052 24.117 20.7581 20.5938 20.7581C17.0705 20.7581 14.1875 17.8052 14.1875 14.129C14.1875 10.4528 17.0705 7.5 20.5938 7.5C24.117 7.5 27 10.4528 27 14.129Z" fill="#C6C6C6" stroke="white"/>
  </svg>

const searchIcon =
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.414 20.586L18.337 15.509C19.386 13.928 20 12.035 20 10C20 4.486 15.514 0 10 0C4.486 0 0 4.486 0 10C0 15.514 4.486 20 10 20C12.035 20 13.928 19.386 15.509 18.337L20.586 23.414C21.366 24.195 22.634 24.195 23.414 23.414C24.195 22.633 24.195 21.367 23.414 20.586ZM3 10C3 6.14 6.14 3 10 3C13.86 3 17 6.14 17 10C17 13.86 13.86 17 10 17C6.14 17 3 13.86 3 10Z" fill="#BBBBBB"/>
  </svg>

const filterIcon =
  <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="4" rx="2" fill="#BBBBBB"/>
    <rect y="8" width="24" height="4" rx="2" fill="#BBBBBB"/>
    <rect y="16" width="24" height="4" rx="2" fill="#BBBBBB"/>
  </svg>

const Players: NextPage<PlayersPageProps> = ({ players }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(players)

  if (data.length > 0) {
    console.log(data)
  }

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const submitSearch = async () => {
    const response = await axios.get(`/api/players/search?name=${search}`)

    if (response.status === 200) {
      setData(response.data)
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={styles.playersContainer}>
      <div className={styles.header}>
        LIGA TENNISA APP
      </div>
      {!isOpen && <div className={styles.search}>
        <button onClick={submitSearch} className={styles.searchButton}>
          {searchIcon}
        </button>
        <Input
          placeholder="Введите имя игрока"
          value={search}
          onChange={handleSearch}
        />
        <button onClick={() => setIsOpen(true)} className={styles.filterButton}>
          {filterIcon}
        </button>
      </div>}
      {isOpen && <div className={styles.popupContainer}>
        <button onClick={() => setIsOpen(false)} className={styles.filterButton}>
          {filterIcon}
        </button>
        <ul>
          <p>Фильтр по категориям</p>
          {['Топ 10 игроков Лиги', 'Рейтинг ЭЛО', 'Количество сыгранных матчей', 'Процент выигранных тай-брейков', 'Среднее число ударов'].map( e => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </div>}
      <span className={styles.listTitle}>Список игроков</span>
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
            {data.map(({ id, first_name, last_name, level, rankings_singles_current, avatar }) => (
              <Link key={id} href={'/players/' + id}>
                <tr key={id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.userImage}>
                        {avatar ?  <Image src={ligaLogo} alt={first_name + ' ' + last_name}/> : noAvatarIcon}
                      </div>
                        <p>{first_name}<br/>{last_name}</p>
                    </div>
                  </td>
                  <td>{LEVEL_NUMBER_VALUES[level]}</td>
                  <td>1489</td>
                </tr>
              </Link>
            ))}
          </tbody>
        </table>
      </div>
    </div >
  )
}

export const getServerSideProps = async () => {
  const prisma = new PrismaClient()

  const players = await prisma.player.findMany({
    take: 5,
    // include: { tournament_players: true }
  })

  return {
    props: {
      players,
    }
  }
}

export default Players
