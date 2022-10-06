import type { NextPage } from 'next'
import Link from 'next/link'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';

import styles from '../../styles/Players.module.scss'

function createData(
  id: number,
  name: string,
  level: string,
  points: number,
) {
  return { id, name, level, points, link: '/players/profile' };
}

const rows = [
  createData(1, 'Frozen yoghurt', 'Masters', 2400),
  createData(2, 'Ice cream sandwich', 'Futures', 2100),
  createData(3, 'Eclair', 'Chellenger', 1200),
  createData(4, 'Cupcake', 'Leger', 600),
  createData(5, 'Gingerbread', 'Settelite', 1),
  createData(6, 'Frozen yoghurt', 'Masters', 2400),
  createData(7, 'Ice cream sandwich', 'Futures', 2100),
  createData(8, 'Eclair', 'Chellenger', 1200),
  createData(9, 'Gingerbread', 'Settelite', 1),
  createData(71, 'Ice cream sandwich', 'Futures', 2100),
  createData(18, 'Eclair', 'Chellenger', 1200),
  createData(29, 'Gingerbread', 'Settelite', 1),
  createData(1228, 'Eclair', 'Chellenger', 1200),
  createData(219, 'Gingerbread', 'Settelite', 1),
  createData(118, 'Eclair', 'Chellenger', 1200),
  createData(219, 'Gingerbread', 'Settelite', 1),
];

const Players: NextPage = () => {
  return (
    <div className={styles.playersContainer}>
      <div className={styles.header}>
        LIGA TENNISA APP
      </div>
      <TextField label="Введите имя игрока" variant="filled" color='primary' />
      <span className={styles.listTitle}>Список игроков</span>
      <TableContainer component={Paper} className={styles.playersTable}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell align="left">Уровень</TableCell>
              <TableCell align="right">Очки</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <Link key={row.id} href={row.link + '/' + row.id}>
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="left">{row.level}</TableCell>
                  <TableCell align="right">{row.points}</TableCell>
                </TableRow>
              </Link>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div >
  )
}

export default Players
