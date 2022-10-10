import { useState } from 'react'
import type { NextPage } from 'next'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import cl from 'classnames'
import { useRouter } from 'next/router'
import { FaMedal } from 'react-icons/fa'

import InfoTab from '../components/profileTabs/Info'
import MatchesTab from '../components/profileTabs/Matches'
import StatsTab from '../components/profileTabs/Stats'

import styles from '../../styles/Profile.module.scss'

const PROFILE_TABS = ['Информация', 'Личные встречи', 'Статистика'];

const Profile: NextPage = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(PROFILE_TABS[0]);

  const activeTabContent = (() => {
    switch (activeTabIndex) {
      case PROFILE_TABS[0]:
        return <InfoTab />;
      case PROFILE_TABS[1]:
        return <MatchesTab />;
      case PROFILE_TABS[2]:
        return <StatsTab />;
      default:
        return null;
    }
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTabIndex(PROFILE_TABS[value])
  }

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader />
      <section>
        <Tabs
          value={PROFILE_TABS.indexOf(activeTabIndex)}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          className={styles.tabsContainer}
          TabIndicatorProps={{ children: null }}
        >
          {PROFILE_TABS.map((tab) => (
            <Tab
              key={tab}
              className={cl(
                styles.tab,
                tab === activeTabIndex ? styles.activeTab : ''
              )}
              label={tab}
            />
          ))}
        </Tabs>
        {activeTabContent}
      </section>
    </div>
  )
}

const ProfileHeader = () => {
  const router = useRouter()
  const { pid } = router.query

  console.log('User id: ' + pid)

  return (
    <div className={styles.profileHeader}>
      <span className={styles.status}>Тренер</span>
      <div className={styles.info}>
        <p className={styles.name}>Маша Ахраменко, userid: {pid}</p>
        <div className={styles.infoContainer}>
          <div className={styles.achievements}>
            <div className={styles.rank}>
              <span className={styles.position}>10</span>
              <span className={styles.positionName}>Супермастерс</span>
            </div>
            <div className={styles.medal}>
              <FaMedal color='yellow' />
              3
            </div>
            <div className={styles.medal}>
              <FaMedal color='lightgrey' />
              6
            </div>
          </div>
          <span className={styles.elo}>1444</span>
        </div>
      </div>
    </div>
  );
}

export default Profile
