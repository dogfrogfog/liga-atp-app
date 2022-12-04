import { useState } from 'react';
import type { NextPage } from 'next';
import { FaMedal } from 'react-icons/fa';
import { PrismaClient, player } from '@prisma/client';

import InfoTab from '../components/profileTabs/Info';
import MatchesTab from '../components/profileTabs/Matches';
import StatsTab from '../components/profileTabs/Stats';
import { LEVEL_NUMBER_VALUES } from '../../constants/values';
import styles from '../../styles/Profile.module.scss';
import TabsMUI from 'ui-kit/Tabs';

const PROFILE_TABS = ['Информация', 'История матчей', 'Статистика'];

const SingleProfilePage: NextPage<{ player: player }> = ({ player }) => {
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
    level,
    age,
    gameplay_style,
    forehand,
    beckhand,
    insta_link,
    is_coach,
    in_tennis_from,
    job_description,
  } = player;

  const activeTabContent = (() => {
    switch (activeTabIndex) {
      case PROFILE_TABS[0]:
        return (
          <InfoTab
            age={age}
            city={city}
            height={170}
            job_description={job_description}
            in_tennis_from={in_tennis_from}
            gameplay_style={gameplay_style}
            forehand={forehand}
            beckhand={beckhand}
            insta_link={insta_link}
          />
        );
      case PROFILE_TABS[1]:
        return <MatchesTab playerId={id} />;
      case PROFILE_TABS[2]:
        return <StatsTab playerId={id} />;
      default:
        return null;
    }
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTabIndex(PROFILE_TABS[value]);
  };

  // get last node from db
  // @ts-ignore
  // const { position, points } = rankingssinglescurrent[rankingssinglescurrent.length - 1]

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader
        is_coach={is_coach as boolean}
        name={first_name + ' ' + last_name}
        level={LEVEL_NUMBER_VALUES[(level as number).toString()]}
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
