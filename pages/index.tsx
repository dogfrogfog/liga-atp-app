import type { NextPage } from 'next'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>home page</h1>
      <h3>available links</h3>
      <Link href="/admin">admin panel</Link>
      <br />
      <Link href="/profile">profile</Link>
      <br />
      <Link href="/tournaments">tournaments</Link>
      <br />
      <Link href="/digest">digest</Link>
      <br />
      <Link href="/elo">elo</Link>
      <br />
      <Link href="/h2h">head to head</Link>
      <br />
      <Link href="/other">other</Link>
      <br />
    </div>
  )
}

export default Home
