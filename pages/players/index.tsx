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
import { FiMenu, FiSearch } from 'react-icons/fi'
import { BsFillPersonFill } from 'react-icons/bs'

// should be nested from schema
interface PlayersPageProps {
  players: any[];
}

const Players: NextPage<PlayersPageProps> = ({ players }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(players)
  const [isOpen, setIsOpen] = useState(false);

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
  return (
    <div className={styles.playersContainer}>
      <div className={styles.header}>
        LIGA TENNISA APP
      </div>
      {!isOpen && <div className={styles.search}>
        <button onClick={submitSearch} className={styles.searchButton}>
          <FiSearch/>
        </button>
        <Input
          placeholder="Введите имя игрока"
          value={search}
          onChange={handleSearch}
        />
        <button onClick={() => setIsOpen(true)} className={styles.filterButton}>
          <FiMenu/>
        </button>
      </div>}
      {isOpen && <div className={styles.popupContainer}>
        <button onClick={() => setIsOpen(false)} className={styles.filterButton}>
          <FiMenu/>
        </button>
        <ul>
          <p>Фильтр по категориям</p>
          {['Топ 10 игроков Лиги', 'Рейтинг ЭЛО', 'Количество сыгранных матчей', 'Процент выигранных тай-брейков', 'Среднее число ударов'].map(v => (
            <li key={v}>{v}</li>
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
                        {avatar ?  <Image src={ligaLogo} alt={first_name + ' ' + last_name}/> : <BsFillPersonFill/>}
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
