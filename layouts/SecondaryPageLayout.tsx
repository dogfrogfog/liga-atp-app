import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { BiArrowBack, BiHomeCircle } from 'react-icons/bi';

import LoadingShadow from 'components/LoadingShadow';
import styles from './SecondaryPageLayout.module.scss';

function SecondaryLayout({
  children,
  loading,
}: {
  children: ReactNode;
  loading: boolean;
}) {
  const router = useRouter();

  return (
    <div className={styles.pageContainer}>
      <button className={styles.back} onClick={() => router.back()}>
        {loading && <LoadingShadow />}
        <BiArrowBack/>
      </button>
        {
          (router.asPath.startsWith('/players') ||  router.asPath.startsWith('/h2h')) &&
            <button className={styles.home} onClick={() => router.push("/")}>
              {loading && <LoadingShadow />}
              <BiHomeCircle/>
            </button>
        }
      {children}
    </div>
  );
}

export default SecondaryLayout;
