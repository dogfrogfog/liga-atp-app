import Link from 'next/link';
import Image from 'next/image';
import { FiSettings } from 'react-icons/fi';
import type { Dispatch, SetStateAction } from 'react';

import ligaLogo from '../../public/180x180.png';
import styles from './Header.module.scss';

type HeaderProps = {
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

const Header = ({ setSidebarOpen }: HeaderProps) => {
  const handleBallIconClick = () => {
    setSidebarOpen((v) => !v);
  };

  return (
    <header className={styles.headerContainer}>
      <div className={styles.image}>
        <button onClick={handleBallIconClick}>
          <Image alt="liga-logo" src={ligaLogo} />
        </button>
      </div>
      <Link href="/admin/settings">
        <span className={styles.settingsIcon}>
          <FiSettings />
        </span>
      </Link>
    </header>
  );
};

export default Header;
