import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { MdOutlineClear } from 'react-icons/md';
import { AiOutlineSearch } from 'react-icons/ai';

// todo: migrate FROM mui
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { PrismaClient } from '@prisma/client'

import Input from 'ui-kit/Input';
import { LEVEL_NUMBER_VALUE } from 'constants/values';
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
      <TableContainer className={styles.playersTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell align="left">Уровень</TableCell>
              <TableCell align="right">Очки</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map(({ id, first_name, last_name, level, rankings_singles_current }) => (
              <Link key={id} href={'/players/' + id}>
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {first_name + ' ' + last_name}
                  </TableCell>
                  <TableCell align="left">{LEVEL_NUMBER_VALUE[level]}</TableCell>
                  <TableCell align="right">
                    {/* {rankings_singles_current.length > 0
                      ? rankings_singles_current[rankings_singles_current.length - 1].points
                      : 0} */}
                      1489
                  </TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
