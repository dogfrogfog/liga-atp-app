import Link from 'next/link';
import { AiOutlineTrophy } from 'react-icons/ai';
import { TbNews } from 'react-icons/tb';
import { GiBabyfootPlayers } from 'react-icons/gi';
import { FiMoreHorizontal } from 'react-icons/fi';

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
        <div className={styles.menuItem}>
          <TbNews />
          <Link href="/admin/digests">Дайджест</Link>
        </div>
        <div className={styles.menuItem}>
          <FiMoreHorizontal />
          <Link href="/admin/other">Прочее</Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
