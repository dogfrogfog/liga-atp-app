import type { ReactNode } from 'react';
import Head from 'next/head';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import styles from './AdminLayout.module.scss';

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.layoutContainer}>
      <Head>
        <title>Admin-panel</title>
        <meta name="description" content="admin panel | Liga Tennisa | Liga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <section className={styles.mainSection}>
        <Sidebar />
        <div className={styles.pageContainer}>{children}</div>
      </section>
    </div>
  );
}

export default AdminLayout;
