import Head from 'next/head'
import type { ReactNode } from 'react'

import Header from './Header'
import Sidebar from './Sidebar'
import styles from './CommonLayout.module.scss'

function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Head>
        <title>Admin-panel</title>
        <meta name="description" content="admin panel for managment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className={styles.mainSection}>
        <Sidebar />
        <div className={styles.pageContainer}>
          {children}
        </div>
      </section>
    </div>
  )
}

export default CommonLayout