import type {NextPage} from 'next'
import Image from 'next/image'
import {ChangeEvent, useState} from 'react'
import Link from 'next/link'
import axios from 'axios'
import {MdOutlineClear} from 'react-icons/md';
import {AiOutlineSearch} from 'react-icons/ai';
import ligaLogo from '../../public/180x180.png'

// todo: migrate FROM mui
import {PrismaClient} from '@prisma/client'

import Input from 'ui-kit/Input';
import {LEVEL_NUMBER_VALUES} from 'constants/values';
import styles from 'styles/Players.module.scss';

// should be nested from schema
interface PlayersPageProps {
  players: any[];
}

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
  return (
    <div className={styles.playersContainer}>
      <div className={styles.header}>
        LIGA TENNISA APP
      </div>
      <div className={styles.search}>
        <Input
          placeholder="Введите имя игрока"
          value={search}
          onChange={handleSearch}
        />
        <button onClick={() => setSearch('')}>
          <MdOutlineClear />
        </button>
        <button onClick={submitSearch}>
          <AiOutlineSearch />
        </button>
      </div>
      <span className={styles.listTitle}>Список игроков</span>
      <div className={styles.playersTable}>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Игрок</td>
              <td align='center'>Уровень</td>
              <td align='center'>Рейтинг</td>
            </tr>
          </thead>
          <tbody>
            {data.map(({ id, first_name, last_name, level, rankings_singles_current, avatar }) => (
              <Link key={id} href={'/players/' + id}>
                <tr key={id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.userImage}>
                        {avatar ?  <Image src={ligaLogo} alt={first_name + ' ' + last_name}/> :
                          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="21" cy="21" r="20.5" stroke="white"/>
                            <path d="M17.3844 17.5645H24.6479C28.3385 17.5645 31.4806 20.2494 32.0562 23.8948L32.5935 27.2982C33.0248 30.0295 30.9138 32.5 28.1486 32.5H13.8717C11.1003 32.5 8.98764 30.019 9.42924 27.283L9.98019 23.8695C10.5667 20.2357 13.7035 17.5645 17.3844 17.5645Z" fill="#C6C6C6" stroke="white"/>
                            <path d="M27 14.129C27 17.8052 24.117 20.7581 20.5938 20.7581C17.0705 20.7581 14.1875 17.8052 14.1875 14.129C14.1875 10.4528 17.0705 7.5 20.5938 7.5C24.117 7.5 27 10.4528 27 14.129Z" fill="#C6C6C6" stroke="white"/>
                          </svg>
                        }
                      </div>
                        <p>{first_name}<br/>{last_name}</p>
                    </div>
                  </td>
                  <td align='center'>{LEVEL_NUMBER_VALUES[level]}</td>
                  <td align='center'>
                    {/* {rankings_singles_current.length > 0
                      ? rankings_singles_current[rankings_singles_current.length - 1].points
                      : 0} */}
                      1489
                  </td>
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
