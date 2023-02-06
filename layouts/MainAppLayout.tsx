import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import cl from 'classnames';
import { FiMoreHorizontal } from 'react-icons/fi';

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

  return (
    <>
      <div className={styles.pageContainer}>{children}</div>
      <div className={styles.bottomMenu}>
        <Link href="/players">
          <a
            className={cl(
              styles.menuItem,
              currentRoute === '/players' ? styles.active : styles.passive
            )}
          >
            <Players />
          </a>
        </Link>
        <Link href="/tournaments">
          <a
            className={cl(
              styles.menuItem,
              currentRoute === '/tournaments' ? styles.active : styles.passive
            )}
          >
            <Tournaments />
          </a>
        </Link>
        <Link href="/digests">
          <a
            className={cl(
              styles.menuItem,
              currentRoute === '/digests' ? styles.active : styles.passive
            )}
          >
            <Digest />
          </a>
        </Link>
        <Link href="/ranking">
          <a
            className={cl(
              styles.menuItem,
              currentRoute === '/ranking' ? styles.active : styles.passive
            )}
          >
            <Rating />
          </a>
        </Link>
        <Link href="/h2h">
          <a
            className={cl(
              styles.menuItem,
              currentRoute === '/h2h' ? styles.active : styles.passive
            )}
          >
            <HeadToHead />
          </a>
        </Link>
        <Link href="/other">
          <a
            className={cl(
              styles.menuItem,
              styles.otherLinkItem,
              currentRoute === '/other' ? styles.active : styles.passive
            )}
          >
            <FiMoreHorizontal />
            <span>Прочее</span>
          </a>
        </Link>
      </div>
    </>
  );
}

export default MainAppLayout;
