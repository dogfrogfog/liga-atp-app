import Link from 'next/link';
import Image from 'next/image';
import { FiSettings } from 'react-icons/fi';

import ligaLogo from '../../public/180x180.png';
import styles from './Header.module.scss';

function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.image}>
        <Link href="/admin">
          <Image alt="liga-logo" src={ligaLogo} />
        </Link>
      </div>
      <Link href="/admin/settings">
        <span className={styles.settingsIcon}>
          <FiSettings />
        </span>
      </Link>
    </header>
  );
}

export default Header;
