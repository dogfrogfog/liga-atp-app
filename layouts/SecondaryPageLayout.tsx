import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';

import LoadingShadow from 'components/LoadingShadow';
import styles from './SecondaryPageLayout.module.scss';
import { useSwipeable } from "react-swipeable";

function SecondaryLayout({
  children,
  loading,
}: {
  children: ReactNode;
  loading: boolean;
}) {
  const router = useRouter();
  const handlerSwipe = useSwipeable({
    onSwipedRight: () => router.push("/")
  });

  return (
    <div className={styles.pageContainer} {...handlerSwipe}>
      <button className={styles.back} onClick={() => router.back()}>
        {loading && <LoadingShadow />}
        <BiArrowBack size="xl" />
      </button>
      {children}
    </div>
  );
}

export default SecondaryLayout;
