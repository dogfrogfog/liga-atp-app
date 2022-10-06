import type { ReactNode } from 'react'
import Link from 'next/link'
import { FiUsers } from 'react-icons/fi'
import { AiOutlineUnorderedList } from 'react-icons/ai'
import { BiNews } from 'react-icons/bi'
import { TbMilitaryRank } from 'react-icons/tb'
import { HiViewList } from 'react-icons/hi'

import styles from './MainAppLayout.module.scss'

// const BottomMenuItem = ({ label, icon }: { label: string, icon: ReactNode }) => (

// )

function MainAppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className={styles.pageContainer}>
        {children}
      </div>
      <div className={styles.bottomMenu}>
        <Link href="/players">
          <div className={styles.menuItem}>
            <FiUsers />
            Игроки
          </div>
        </Link>
        <Link href="/tournaments">
          <div className={styles.menuItem}>
            <AiOutlineUnorderedList />
            Турниры
          </div>
        </Link>
        <Link href="/digest">
          <div className={styles.menuItem}>
            <BiNews />
            Дайдж
          </div>
        </Link>
        <Link href="/elo">
          <div className={styles.menuItem}>
            <TbMilitaryRank />
            Эло
          </div>
        </Link>
        <Link href="/h2h">
          <div className={styles.menuItem}>
            <FiUsers />
            H2H
          </div>
        </Link>
        <Link href="/other">
          <div className={styles.menuItem}>
            <HiViewList />
            Прочее
          </div>
        </Link>
      </div>
    </>
  )
}

export default MainAppLayout