import type { NextPage } from 'next'
import Link from 'next/link'
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
  console.log(players)

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
      <TextField label="Введите имя игрока" variant="filled" color='primary' />
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
            {players.map(({ id, first_name, last_name, level, core_elorankingssinglescurrent }) => (
              <Link key={id} href={'/players/' + id}>
                <TableRow key={id}>
                  <TableCell component="th" scope="row">
                    {first_name + ' ' + last_name}
                  </TableCell>
                  <TableCell align="left">{level}</TableCell>
                  <TableCell align="right">{core_elorankingssinglescurrent}</TableCell>
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
    take: 50,
  });

  console.log(players);

  return {
    props: {
      players,
    }
  }
}

export default Players
