import { useState } from 'react'
import type { NextPage } from 'next'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import cl from 'classnames'
import { FaMedal } from 'react-icons/fa'
import { PrismaClient, core_player } from '@prisma/client'

import InfoTab from '../components/profileTabs/Info'
import MatchesTab from '../components/profileTabs/Matches'
import StatsTab from '../components/profileTabs/Stats'

import { LevelNumberMap } from '../../constants/values'

import styles from '../../styles/Profile.module.scss'

const PROFILE_TABS = ['Информация', 'Личные встречи', 'Статистика'];

const Profile: NextPage<{ player: core_player }> = ({ player }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(PROFILE_TABS[0]);

  const {
    id,
    first_name,
    last_name,
    date_of_birth,
    city,
    country,
    email,
    phone,
    avatar,
    age,
    job_description,
    years_in_tennis,
    gameplay_style,
    forehand,
    beckhand,
    insta_link,
    is_coach,
    medals,
    level,
    // add height to db
    height = 170,
  } = player;

  const activeTabContent = (() => {
    switch (activeTabIndex) {
      case PROFILE_TABS[0]:
        return (
          <InfoTab
            age={age}
            city={city}
            height={height}
            job_description={job_description}
            years_in_tennis={years_in_tennis}
            gameplay_style={gameplay_style}
            forehand={forehand}
            beckhand={beckhand}
            insta_link={insta_link}
          />
        );
      case PROFILE_TABS[1]:
        return <MatchesTab playerId={id} />;
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
      {/* @ts-ignore */}
      <ProfileHeader
        name={first_name + ' ' + last_name}
        level={LevelNumberMap[level.toString()]}
      />
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

interface IProfileHeaderProps {
  name: string
  level: string
}

const ProfileHeader = ({ name, level }: IProfileHeaderProps) => {
  return (
    <div className={styles.profileHeader}>
      <span className={styles.status}>Тренер</span>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <div className={styles.infoContainer}>
          <div className={styles.achievements}>
            <div className={styles.rank}>
              {/* <span className={styles.position}>10</span> */}
              <span className={styles.positionName}>{level}</span>
            </div>
            <div className={styles.medal}>
              <FaMedal color='yellow' />
              {'<3>'}
            </div>
            <div className={styles.medal}>
              <FaMedal color='lightgrey' />
              {'<6>'}
            </div>
          </div>
          <span className={styles.elo}>1444</span>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx: any) => {
  const prisma = new PrismaClient()

  // data inside sqlite db
  const player = await prisma.core_player.findUnique({
    where: {
      id: parseInt(ctx.query.pid)
    }
  })

  return {
    props: {
      player,
    }
  }
}

export default Profile
