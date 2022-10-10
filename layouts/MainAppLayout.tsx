import type { ReactNode } from 'react'
import Link from 'next/link'
import cl from 'classnames'
import { useRouter } from 'next/router'
import { FiUsers } from 'react-icons/fi'
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { BiNews } from 'react-icons/bi'
import { TbMilitaryRank } from 'react-icons/tb'
import { HiViewList } from 'react-icons/hi'

import styles from './MainAppLayout.module.scss'

function MainAppLayout({ children }: { children: ReactNode }) {
  const currentRoute = useRouter().pathname

  return (
    <>
      <div className={styles.pageContainer}>
        {children}
      </div>
      <div className={styles.bottomMenu}>
        <Link href="/players">
          <div className={cl(styles.menuItem, currentRoute === '/players' ? styles.active : '')}>
            <FiUsers />
            Игроки
          </div>
        </Link>
        <Link
          href="/tournaments"
          className={currentRoute === '/tournaments' ? styles.active : ''}
        >
          <div className={cl(styles.menuItem, currentRoute === '/tournaments' ? styles.active : '')}>
            <AiOutlineUnorderedList />
            Турниры
          </div>
        </Link>
        <Link href="/digest">
          <div className={cl(styles.menuItem, currentRoute === '/digest' ? styles.active : '')}>
            <BiNews />
            Дайдж
          </div>
        </Link>
        <Link href="/elo">
          <div className={cl(styles.menuItem, currentRoute === '/elo' ? styles.active : '')}>
            <TbMilitaryRank />
            Эло
          </div>
        </Link>
        <Link href="/h2h">
          <div className={cl(styles.menuItem, currentRoute === '/h2h' ? styles.active : '')}>
            <FiUsers />
            H2H
          </div>
        </Link>
        <Link href="/other">
          <div className={cl(styles.menuItem, currentRoute === '/other' ? styles.active : '')}>
            <HiViewList />
            Прочее
          </div>
        </Link>
      </div>
    </>
  )
}

export default MainAppLayout