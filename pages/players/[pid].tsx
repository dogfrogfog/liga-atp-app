import { useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import { useRouter } from 'next/router';
import { FaMedal } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa';
import type { player as PlayerT, digest as DigestT } from '@prisma/client';

import { prisma } from 'services/db';
import InfoTab from 'components/profileTabs/Info';
import ScheduleTab from 'components/profileTabs/Schedule';
import MatchesHistoryTab from 'components/profileTabs/MatchesHistory';
import StatsTab from 'components/profileTabs/Stats';
import DigestListEl from 'components/DigestListEl';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import Tabs from 'ui-kit/Tabs';
import useMatches from 'hooks/useMatches';
import useStats from 'hooks/useStats';
import { LEVEL_NUMBER_VALUES } from 'constants/values';
import type { MatchWithTournamentType } from 'utils/getOpponents';
import { isMatchPlayed } from 'utils/isMatchPlayed';
import styles from 'styles/Profile.module.scss';

const PROFILE_TABS = [
  'Информация',
  'Расписание',
  'История матчей',
  'Статистика',
  'Дайджесты',
];

export const calculateYearsFromDate = (date: Date) => {
  var diff_ms = Date.now() - date.getTime();
  var age_dt = new Date(diff_ms);

  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

const SingleProfilePage: NextPage<{ player: PlayerT; digests: DigestT[] }> = ({
  player,
  digests,
}) => {
  const [activeTab, setActiveTab] = useState(PROFILE_TABS[0]);
  const [statsTabTournamentType, setStatsTabTournamentTypeDropdown] =
    useState(999);
  const router = useRouter();

  const { matches } = useMatches(player.id);
  const { statsData } = useStats(
    player.id,
    statsTabTournamentType === 999 ? undefined : statsTabTournamentType
  );

  const {
    id,
    date_of_birth,
    city,
    first_name,
    last_name,
    country,
    avatar,
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
      if (isMatchPlayed(match)) {
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

  const onDigestClick = (id: number) => {
    router.push(`/digests/${id}`);
  };

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
            yearsInTennis={
              in_tennis_from ? calculateYearsFromDate(in_tennis_from) + '' : ''
            }
            playerId={id}
            gameplayStyle={gameplay_style || ''}
            selectedLvl={statsTabTournamentType}
            setSelectedLvl={setStatsTabTournamentTypeDropdown}
            technique={technique}
            tactics={tactics}
            power={power as number}
            shakes={shakes}
            serve={serve}
            behaviour={behaviour}
            statsData={statsData as any}
          />
        );
      case PROFILE_TABS[4]:
        return digests.length > 0 ? (
          digests.map((d) => (
            <DigestListEl key={d.id} {...d} onClick={onDigestClick} />
          ))
        ) : (
          <NotFoundMessage message="Нет упоминаний об игроке" />
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
        avavarUrl={avatar || ''}
        isCoach={!!is_coach}
        name={first_name + ' ' + last_name}
        level={LEVEL_NUMBER_VALUES[(level as any)?.toString()]}
        // todo: add real elo rank
        points={'1490'}
        tournamentsWins={(statsData as any)?.tournaments_wins}
        tournamentsFinals={(statsData as any)?.tournaments_finals}
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
  avavarUrl: string;
  name: string;
  level: string;
  points: string;
  isCoach: boolean;
  tournamentsWins?: number;
  tournamentsFinals?: number;
}

const ProfileHeader = ({
  avavarUrl,
  name,
  level,
  points,
  isCoach,
  tournamentsWins,
  tournamentsFinals,
}: IProfileHeaderProps) => {
  return (
    <div
      className={styles.profileHeader}
      style={{ background: `url(${avavarUrl})`, backgroundSize: 'cover' }}
    >
      {!avavarUrl && (
        <div className={styles.noAvatarBlock}>
          <FaUserAlt />
        </div>
      )}
      <span className={styles.status}>{isCoach ? 'Тренер' : 'Игрок'}</span>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <div className={styles.infoContainer}>
          <div className={styles.achievements}>
            <div className={styles.rank}>
              <span className={styles.positionName}>{level}</span>
            </div>
            <div className={styles.medal}>
              <FaMedal color="yellow" />
              {` ${tournamentsWins}`}
            </div>
            <div className={styles.medal}>
              <FaMedal color="lightgrey" />
              {` ${(tournamentsFinals || 0) - (tournamentsWins || 0)}`}
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

  const digests = await prisma.digest.findMany({
    where: {
      mentioned_players_ids: {
        has: parseInt(ctx.query.pid as string, 10),
      },
    },
  });

  return {
    props: {
      player,
      digests: digests || [],
    },
  };
};

export default SingleProfilePage;
