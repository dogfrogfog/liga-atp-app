import type { ReactNode } from 'react';
import { useRouter } from 'next/router';
import { BiArrowBack } from 'react-icons/bi';

import LoadingShadow from 'components/LoadingShadow';
import styles from './SecondaryPageLayout.module.scss';
import { SwipeEventData, useSwipeable } from "react-swipeable";

function SecondaryLayout({
  children,
  loading,
}: {
  children: ReactNode;
  loading: boolean;
}) {
  const router = useRouter();
  const handleSwiping = (eventData: SwipeEventData) => {
    const { deltaX } = eventData;
    const swipeThreshold = window.innerWidth / 2; // 50% экрана

    if (deltaX > 0 && deltaX < swipeThreshold) {
      const percentage = (deltaX / swipeThreshold) * 100;
      const translateX = `translateX(${percentage}%)`;
      document.documentElement.style.setProperty('--swipe-translate', translateX);
    }
  };

  const handleSwipeEnd = (eventData: SwipeEventData) => {
    const { deltaX } = eventData;
    if (deltaX > window.innerWidth / 2) {
      router.push("/");
      document.documentElement.style.removeProperty('--swipe-translate');
    }
  };

  const swipeHandlers = useSwipeable({
    onSwiping: handleSwiping,
    onSwiped: handleSwipeEnd,
  });
  return (
    <div className={styles.pageContainer} {...swipeHandlers}>
      <button className={styles.back} onClick={() => router.back()}>
        {loading && <LoadingShadow />}
        <BiArrowBack size="xl" />
      </button>
      {children}
    </div>
  );
}

export default SecondaryLayout;
