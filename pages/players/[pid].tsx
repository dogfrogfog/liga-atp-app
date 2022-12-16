import { useState } from 'react';
import type { NextPage } from 'next';
import { FaMedal } from 'react-icons/fa';
import { PrismaClient, player } from '@prisma/client';

import InfoTab from '../components/profileTabs/Info';
import ScheduleTab from '../components/profileTabs/Schedule';
import MatchesHistoryTab from '../components/profileTabs/MatchesHistory';
import StatsTab from '../components/profileTabs/Stats';
import NewsTab from '../components/profileTabs/News';
import { LEVEL_NUMBER_VALUES } from '../../constants/values';
import styles from '../../styles/Profile.module.scss';
import TabsMUI from 'ui-kit/Tabs';

const PROFILE_TABS = ['Информация', 'Расписание', 'История матчей', 'Статистика', 'Новости'];

const calculateYearsFromDate = (date: Date) => {
  var diff_ms = Date.now() - date.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

const SingleProfilePage: NextPage<{ player: player }> = ({ player }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(PROFILE_TABS[0]);

  const {
    id,
    date_of_birth,
    city,
    first_name,
    last_name,
    country,
    // email,
    // phone,

    // todo: work on avatar
    // avatar,

    level,
    gameplay_style,
    forehand,
    beckhand,
    insta_link,
    is_coach,
    in_tennis_from,
    job_description,
    height,

    technique,
    tactics,
    power,
    shakes,
    serve,
    behaviour,
  } = player;


  console.log(player)
  const activeTabContent = (() => {
    switch (activeTabIndex) {
      case PROFILE_TABS[0]:
        return (
          <InfoTab
            age={calculateYearsFromDate(date_of_birth as Date)}
            country={country || ''}
            city={city || ''}
            height={height || ''}
            jobDescription={job_description || ''}
            yearsInTennis={in_tennis_from && calculateYearsFromDate(in_tennis_from)}
            gameplayStyle={gameplay_style || ''}
            forehand={forehand || ''}
            beckhand={beckhand || ''}
            instaLink={insta_link || ''}
          />
        );
      case PROFILE_TABS[1]:
        return <ScheduleTab />
      case PROFILE_TABS[2]:
        return <MatchesHistoryTab playerId={id} />;
      case PROFILE_TABS[3]:
        return (
          <StatsTab
            playerId={id}
            technique={technique}
            tactics={tactics}
            power={power as number}
            shakes={shakes}
            serve={serve}
            behaviour={behaviour}
          />
        );
      case PROFILE_TABS[4]:
        return <NewsTab />;
      default:
        return null;
    }
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTabIndex(PROFILE_TABS[value]);
  };

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader
        is_coach={is_coach as boolean}
        name={first_name + ' ' + last_name}
        level={LEVEL_NUMBER_VALUES[(level as any)?.toString()]}
        // todo: add real elo rank
        points={'1490'}
      />
      <section>
        <TabsMUI
          activeTabIndex={activeTabIndex}
          onChange={handleTabChange}
          tabNames={PROFILE_TABS}
        />
        {activeTabContent}
      </section>
    </div>
  );
};

interface IProfileHeaderProps {
  name: string;
  level: string;
  points: string;
  is_coach: boolean;
}

const ProfileHeader = ({
  name,
  level,
  points,
  is_coach,
}: IProfileHeaderProps) => {
  return (
    <div className={styles.profileHeader}>
      <span className={styles.status}>{is_coach ? 'Тренер' : 'Игрок'}</span>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <div className={styles.infoContainer}>
          <div className={styles.achievements}>
            <div className={styles.rank}>
              {/* <span className={styles.position}>10</span> */}
              <span className={styles.positionName}>{level}</span>
            </div>
            <div className={styles.medal}>
              <FaMedal color="yellow" />
              {'<3>'}
            </div>
            {/* <div className={styles.medal}>
              <FaMedal color='lightgrey' />
              {'<6>'}
            </div> */}
          </div>
          <span className={styles.elo}>{points}</span>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: any) => {
  const prisma = new PrismaClient();

  const player = await prisma.player.findUnique({
    where: {
      id: parseInt(ctx.query.pid),
    },
  });

  return {
    props: {
      player,
    },
  };
};

export default SingleProfilePage;
