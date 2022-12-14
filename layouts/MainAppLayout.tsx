import type { ReactNode } from 'react';
import Link from 'next/link';
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
  const currentRoute = useRouter().pathname;

  return (
    <>
      <div className={styles.pageContainer}>{children}</div>
      <div className={styles.bottomMenu}>
        <Link href="/players">
          <div
            className={cl(
              styles.menuItem,
              currentRoute === '/players' ? styles.active : styles.passive
            )}
          >
            <Players />
          </div>
        </Link>
        <Link href="/tournaments">
          <div
            className={cl(
              styles.menuItem,
              currentRoute === '/tournaments' ? styles.active : styles.passive
            )}
          >
            <Tournaments />
          </div>
        </Link>
        <Link href="/digest">
          <div
            className={cl(
              styles.menuItem,
              currentRoute === '/digest' ? styles.active : ''
            )}
          >
            <Digest />
          </div>
        </Link>
        <Link href="/ranking">
          <div
            className={cl(
              styles.menuItem,
              currentRoute === '/ranking' ? styles.active : ''
            )}
          >
            <Rating />
          </div>
        </Link>
        <Link href="/h2h">
          <div
            className={cl(
              styles.menuItem,
              currentRoute === '/h2h' ? styles.active : ''
            )}
          >
            <HeadToHead />
          </div>
        </Link>
      </div>
    </>
  );
}

export default MainAppLayout;
