import Link from 'next/link';
import { AiOutlineTrophy } from 'react-icons/ai';
import { TbNews } from 'react-icons/tb';
import { GiBabyfootPlayers } from 'react-icons/gi';
import { FiMoreHorizontal } from 'react-icons/fi';

import styles from 'styles/Sidebar.module.scss';

const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.sidebarTop}>
        <Link href="/admin">
          <a className={styles.menuItem}>Главная</a>
        </Link>
        <Link href="/admin/players">
          <a className={styles.menuItem}>
            <GiBabyfootPlayers />
            Игроки
          </a>
        </Link>
        <Link href="/admin/tournaments">
          <a className={styles.menuItem}>
            <AiOutlineTrophy />
            Турниры
          </a>
        </Link>
        <Link href="/admin/digests">
          <a className={styles.menuItem}>
            <TbNews />
            Дайджест
          </a>
        </Link>
        <Link href="/admin/other">
          <a className={styles.menuItem}>
            <FiMoreHorizontal />
            Прочее
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
