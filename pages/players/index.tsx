import type { NextPage } from 'next'
import { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import { PrismaClient } from '@prisma/client'

import styles from '../../styles/Players.module.scss'

// should be nested from schema
interface PlayersPageProps {
  players: any[];
}

const Players: NextPage<PlayersPageProps> = ({ players }) => {
  const [search, setSearch] = useState('');
  const [data, setData] = useState(players)

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
      <br />
      <br />
      <br />
      wefwef
      <br />
      <br />
      <br />
      <br />
      <TextField
        color="primary"
        label="Введите имя игрока"
        variant="filled"
        value={search}
        onChange={handleSearch}
      />
      <button onClick={() => setSearch('')}>clear</button>
      <button onClick={() => submitSearch()}>search</button>
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
            {data.map(({ id, first_name, last_name, level, core_rankingssinglescurrent }) => (
              <Link key={id} href={'/players/' + id}>
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {first_name + ' ' + last_name}
                  </TableCell>
                  <TableCell align="left">{level}</TableCell>
                  <TableCell align="right">
                    {core_rankingssinglescurrent.length > 0
                      ? core_rankingssinglescurrent[core_rankingssinglescurrent.length - 1].points
                      : 0}
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

  // data inside sqlite db
  const players = await prisma.core_player.findMany({
    take: 10,
    include: { core_rankingssinglescurrent: true }
  })

  return {
    props: {
      players,
    }
  }
}

export default Players
