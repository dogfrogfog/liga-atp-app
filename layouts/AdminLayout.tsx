import { ReactNode, useState } from 'react';
import Head from 'next/head';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import styles from './AdminLayout.module.scss';

function AdminLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={styles.layoutContainer}>
      <Head>
        <title>Admin-panel</title>
        <meta name="description" content="admin panel | Liga Tennisa | Liga" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header setSidebarOpen={setSidebarOpen} />
      <section className={styles.mainSection}>
        {sidebarOpen && <Sidebar />}
        <div className={styles.pageContainer}>{children}</div>
      </section>
    </div>
  );
}

export default AdminLayout;
