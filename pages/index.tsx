import type { NextPage } from 'next'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <h1>home page</h1>
      <Link href="/profile">/profile link</Link>
    </div>
  )
}

export default Home
