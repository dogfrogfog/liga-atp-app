import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';

import LoadingShadow from 'components/LoadingShadow';
import styles from './SecondaryPageLayout.module.scss';
import { useSwipeable } from "react-swipeable";
import { useState } from "react";

function SecondaryLayout({
  children,
  loading,
}: {
  children: ReactNode;
  loading: boolean;
}) {
  const router = useRouter();
  const [swipePosition, setSwipePosition] = useState<number>(0);
  const swipe = useSwipeable({
    onSwipedRight: (eventData) => handleSwipe(eventData.deltaX)
  });
  const handleSwipe = (deltaX: number) => {
    setSwipePosition((prevPosition) => prevPosition + deltaX);
    if (swipePosition > window.innerWidth * 0.75){
      router.push("/");
    }
  };

  return (
    <div className={styles.pageContainer} {...swipe}>
      <button className={styles.back} onClick={() => router.back()}>
        {loading && <LoadingShadow />}
        <BiArrowBack size="xl" />
      </button>
      {children}
    </div>
  );
}

export default SecondaryLayout;
