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
  const config = {
    delta: 10,
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  };
  const swipeThreshold = window.innerHeight;
  const handleSwiping = (eventData: SwipeEventData) => {
    const {deltaY, absY, velocity} = eventData;
    if (deltaY < 0) return;
    else if(deltaY >= 0 && window.pageYOffset === 0 && velocity >= 0.4){
      const percentage = (deltaY / swipeThreshold) * 100;
      const translateY = `translateY(${percentage}%)`;
      document.documentElement.style.setProperty('--swipe-translate', translateY);
      if (absY >= 200) {
        router.push('/');
        document.documentElement.style.removeProperty('--swipe-translate');
      }
    }
    else if (window.pageYOffset > 0){
      document.documentElement.style.removeProperty('--swipe-translate');
    }

  };


  const swipeHandlers = useSwipeable({
    onSwiping: handleSwiping,
    ...config
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
