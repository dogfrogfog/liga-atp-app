import { useState, useEffect } from 'react';
import type { NextPage, NextPageContext } from 'next';
import { FaMedal } from 'react-icons/fa';
import { player as PlayerT } from '@prisma/client';
import axios from 'axios';

import type { StatsDataType } from 'pages/api/stats';
import { prisma } from 'services/db';
import InfoTab from 'components/profileTabs/Info';
import ScheduleTab from 'components/profileTabs/Schedule';
import MatchesHistoryTab from 'components/profileTabs/MatchesHistory';
import StatsTab from 'components/profileTabs/Stats';
import NewsList from 'components/NewsList';
import { LEVEL_NUMBER_VALUES } from 'constants/values';
import type { MatchWithTournamentType } from 'utils/getOpponents';
import Tabs from 'ui-kit/Tabs';
import styles from 'styles/Profile.module.scss';

const PROFILE_TABS = [
  'Информация',
  'Расписание',
  'История матчей',
  'Статистика',
  'Новости',
];

const calculateYearsFromDate = (date: Date) => {
  var diff_ms = Date.now() - date.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

const SingleProfilePage: NextPage<{ player: PlayerT }> = ({ player }) => {
  const [matches, setMatches] = useState<MatchWithTournamentType[]>([]);
  const [activeTab, setActiveTab] = useState(PROFILE_TABS[0]);
  const [statsData, setStatsData] = useState<StatsDataType | undefined>();
  const [statsTabLvlDropdown, setStatsTabLvlDropdown] = useState(
    player.level || undefined
  );

  useEffect(() => {
    const fetchWrapper = async () => {
      const response = await axios.get(`/api/matches?id=${player.id}`);

      if (response.status === 200) {
        setMatches(response.data);
      }

      const statsResp = await axios.get(
        `/api/stats?playerId=${player.id}&level=${statsTabLvlDropdown}`
      );

      if (statsResp.status === 200) {
        setStatsData(statsResp.data);
      }
    };

    fetchWrapper();
  }, [player.id, statsTabLvlDropdown]);

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

  const { upcomingMatches, playedMatches } = matches.reduce(
    (acc, match) => {
      const isMatchPlayed =
        !!(match.winner_id && match.score) || match.is_completed === true;

      if (isMatchPlayed) {
        acc.playedMatches.push(match);
      } else {
        acc.upcomingMatches.push(match);
      }
      return acc;
    },
    {
      upcomingMatches: [] as MatchWithTournamentType[],
      playedMatches: [] as MatchWithTournamentType[],
    }
  );

  const activeTabContent = (() => {
    switch (activeTab) {
      case PROFILE_TABS[0]:
        return (
          <InfoTab
            age={date_of_birth && calculateYearsFromDate(date_of_birth)}
            country={country || ''}
            city={city || ''}
            height={height || ''}
            jobDescription={job_description || ''}
            yearsInTennis={
              in_tennis_from && calculateYearsFromDate(in_tennis_from)
            }
            gameplayStyle={gameplay_style || ''}
            forehand={forehand || ''}
            beckhand={beckhand || ''}
            instaLink={insta_link || ''}
          />
        );
      case PROFILE_TABS[1]:
        return (
          <ScheduleTab playerId={player.id} upcomingMatches={upcomingMatches} />
        );
      case PROFILE_TABS[2]:
        return (
          <MatchesHistoryTab
            playerId={player.id}
            playedMatches={playedMatches}
          />
        );
      case PROFILE_TABS[3]:
        return (
          <StatsTab
            playerId={id}
            selectedLvl={statsTabLvlDropdown}
            setSelectedLvl={setStatsTabLvlDropdown}
            technique={technique}
            tactics={tactics}
            power={power as number}
            shakes={shakes}
            serve={serve}
            behaviour={behaviour}
            statsData={statsData}
          />
        );
      case PROFILE_TABS[4]:
        return (
          <NewsList
            news={new Array(3).fill({
              title: 'Вторая травма ахила за неделю',
              date: '11.11.2022',
              desc: 'Lorem ipsum dolor sit amet, con',
              id: Math.round(Math.random() * 100),
            })}
          />
        );
      default:
        return null;
    }
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(PROFILE_TABS[value]);
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
        <Tabs
          activeTab={activeTab}
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
              <FaMedal color="yellow" />3
            </div>
            <div className={styles.medal}>
              <FaMedal color="lightgrey" />6
            </div>
          </div>
          <span className={styles.elo}>{points}</span>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const player = await prisma.player.findUnique({
    where: {
      id: parseInt(ctx.query.pid as string),
    },
  });

  return {
    props: {
      player,
    },
  };
};

export default SingleProfilePage;
