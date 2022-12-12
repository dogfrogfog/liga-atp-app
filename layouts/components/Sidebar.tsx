import Link from 'next/link';
import { AiOutlineTrophy } from 'react-icons/ai';
import { BiNews, BiSupport } from 'react-icons/bi';
import { GiBabyfootPlayers } from 'react-icons/gi';
import cl from 'classnames';

import styles from '../../styles/Sidebar.module.scss';

const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarTop}>
        <div className={styles.menuItem}>
          <GiBabyfootPlayers />
          <Link href="/admin/players">Игроки</Link>
        </div>
        <div className={styles.menuItem}>
          <AiOutlineTrophy />
          <Link href="/admin/tournaments">Турниры</Link>
        </div>
        {/* <div className={styles.menuItem}>
          <BiNews />
          <Link href="/admin/content">Матчи</Link>
        </div> */}
        {/* <div className={styles.menuItem}>
          <BiStats />
          <Link href="/admin/stats">
            Статистика приложения
          </Link>
        </div> */}
      </div>
      {/* <div className={styles.sidebarTop}>
        <div className={cl(styles.menuItem, styles.supportItem)}>
          <BiSupport />
          <a href="mailto:maksim.hodasevich@gmail.com">
            Support
            <br />
            <span>
              (only emergency)
            </span>
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
