import type { NextPage } from 'next'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

const Players: NextPage = () => {
  return (
    <div className={styles.container}>
      <Link href="/">home</Link>

      <h1>Players page</h1>
      players table
      <br/>
      players table
      <br/>
      players table
      <br/>
      players table
      <br/>
      players table
      <br/>
      players table
      <br/>
      <input type="text" placeholder="Поиск игрока" />
    </div>
  )
}

export default Players
