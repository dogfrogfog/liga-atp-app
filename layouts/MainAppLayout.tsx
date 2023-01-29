import type { ReactNode } from 'react';
import cl from 'classnames';
import { useRouter } from 'next/router';

import styles from './MainAppLayout.module.scss';
import {
  Digest,
  HeadToHead,
  Players,
  Rating,
  Tournaments,
} from './MainAppLayoutIcons';

function MainAppLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const currentRoute = router.pathname;

  const onLinkClick = (url: string) => {
    router.push(url);
  };

  return (
    <>
      <div className={styles.pageContainer}>{children}</div>
      <div className={styles.bottomMenu}>
        <button
          onClick={() => onLinkClick('/players')}
          className={cl(
            styles.menuItem,
            currentRoute === '/players' ? styles.active : styles.passive
          )}
        >
          <Players />
        </button>
        <button
          onClick={() => onLinkClick('/tournaments')}
          className={cl(
            styles.menuItem,
            currentRoute === '/tournaments' ? styles.active : styles.passive
          )}
        >
          <Tournaments />
        </button>
        <button
          onClick={() => onLinkClick('/digests')}
          className={cl(
            styles.menuItem,
            currentRoute === '/digests' ? styles.active : ''
          )}
        >
          <Digest />
        </button>
        <button
          onClick={() => onLinkClick('/ranking')}
          className={cl(
            styles.menuItem,
            currentRoute === '/ranking' ? styles.active : ''
          )}
        >
          <Rating />
        </button>
        <button
          onClick={() => onLinkClick('/h2h')}
          className={cl(
            styles.menuItem,
            currentRoute === '/h2h' ? styles.active : ''
          )}
        >
          <HeadToHead />
        </button>
      </div>
    </>
  );
}

export default MainAppLayout;
