import Head from 'next/head'
import type { ReactNode } from 'react'

import Header from './components/Header'
import Sidebar from './components/Sidebar'
import styles from './AdminLayout.module.scss'

// todo: wip
function AdminLayout({ children }: { children: ReactNode }) {
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

export default AdminLayout