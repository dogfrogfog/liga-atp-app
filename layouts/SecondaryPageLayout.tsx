import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';

import styles from './SecondaryPageLayout.module.scss';

function SecondaryLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      <button className={styles.back} onClick={() => router.back()}>
        <BiArrowBack size="xl" />
      </button>
      {children}
    </div>
  );
}

export default SecondaryLayout;
