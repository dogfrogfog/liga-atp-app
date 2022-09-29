import { ReactNode } from 'react'
import Link from 'next/link'
import { Menu, MenuProps } from 'antd'
import { ImFilesEmpty } from 'react-icons/im'
import { AiOutlineTrophy, AiOutlineHome } from 'react-icons/ai'
import { BiNews, BiStats } from 'react-icons/bi'
import { GiTabletopPlayers } from 'react-icons/gi'

import styles from './Sidebar.module.scss'

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: ReactNode, key: string, icon?: ReactNode, children?: MenuItem[]): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items: MenuProps['items'] = [
  getItem(<Link href="/admin/">Главная</Link>, 'home', <AiOutlineHome />),
  getItem('Игроки', 'users', <GiTabletopPlayers />, [
    getItem(<Link href="/admin/users/list">Список игроков</Link>, 'users/list'),
    getItem(<Link href="/admin/users/approve">Подтвердить</Link>, 'users/approve'),
    getItem(<Link href="/admin/users/elo">Эло</Link>, 'users/elo'),
  ]),
  getItem('Турниры', 'tournaments', <AiOutlineTrophy />, [
    getItem(<Link href="/admin/tournaments/list">Список турниров</Link>, 'tournaments/list'),
    getItem(<Link href="/admin/tournaments/create">Создать</Link>, 'tournaments/create'),
    getItem(<Link href="/admin/tournaments/formats">Форматы турниров</Link>, 'tournaments/formats'),
  ]),
  getItem('Контент', 'content', <BiNews />, [
    getItem(<Link href="/admin/content/news">Новости</Link>, 'content/news'),
    getItem(<Link href="/admin/content/digest">Дайджест</Link>, 'content/digest'),
    getItem(<Link href="/admin/content/stream">Трансляция</Link>, 'content/stream'),
  ]),
  getItem('Страницы', 'pages', <ImFilesEmpty />, [
    getItem(<Link href="/admin/pages/list">Список страниц</Link>, 'pages/list'),
    getItem(<Link href="/admin/pages/create">Создать</Link>, 'pages/create'),
  ]),
  getItem(<Link href="/admin/stats">Статистика</Link>, 'stats', <BiStats />),
];

const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <Menu
        defaultSelectedKeys={['home']}
        mode="inline"
        inlineCollapsed={false}
        items={items}
      />
    </div>
  );
};

export default Sidebar