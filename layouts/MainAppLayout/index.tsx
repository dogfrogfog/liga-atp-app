import type { ReactNode } from 'react'
import Link from 'next/link'

import styles from './MainAppLayout.module.scss'

function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={styles.pageContainer}>
        {children}
      </div>
      <div className={styles.bottomMenu}>
        <Link href="/profile">
          profile
        </Link>
        <Link href="/tournaments">
          tournaments
        </Link>
        <Link href="/digest">
          digest
        </Link>
        <Link href="/elo">
          elo
        </Link>
        <Link href="/h2h">
          head to head
        </Link>
        <Link href="/other">
          other
        </Link>
      </div>
    </>
  )
}

export default MainAppLayout