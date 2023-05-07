import { useState, useEffect } from 'react';
import type { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import { FaMedal } from 'react-icons/fa';
import { FiYoutube } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import type {
  player as PlayerT,
  digest as DigestT,
  elo_ranking_change,
} from '@prisma/client';
import {
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
} from 'recharts';
import cl from 'classnames';

import { prisma } from 'services/db';
import InfoTab from 'components/profileTabs/Info';
import ScheduleTab from 'components/profileTabs/Schedule';
import MatchesHistoryTab from 'components/profileTabs/MatchesHistory';
import DigestListEl from 'components/DigestListEl';
import TournamentTypeFilter from 'components/TournamentTypeFilter';
import StatsData from 'components/Stats';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import Tabs from 'ui-kit/Tabs';
import useMatches from 'hooks/useMatches';
import useStats from 'hooks/useStats';
import { LEVEL_NUMBER_VALUES } from 'constants/values';
import type { MatchWithTournamentType } from 'utils/getOpponents';
import { isMatchPlayed } from 'utils/isMatchPlayed';
import calculateYearsFromDate from 'utils/calculateYearsFromDate';
import styles from 'styles/Profile.module.scss';
import { DEFAULT_PROFILE_IMAGE } from 'constants/values';
import { useRouter } from "next/router";

const PROFILE_TABS = [
  'Информация',
  'Расписание',
  'История матчей',
  'Статистика',
  'Характеристика',
  'Дайджесты',
];

const SingleProfilePage: NextPage<{
  player: PlayerT;
  digests: DigestT[];
  eloPoints?: number;
  eloChanges: elo_ranking_change[];
}> = ({ player, digests, eloPoints, eloChanges }) => {
  const [activeTab, setActiveTab] = useState(PROFILE_TABS[0]);
  const [statsTabTournamentType, setStatsTabTournamentTypeDropdown] = useState(999);

  const { matches } = useMatches(player.id);
  const { statsData } = useStats(
    player.id,
    statsTabTournamentType === 999 ? undefined : statsTabTournamentType
  );
  const router = useRouter()
  const {tab} = router.query
  const {
    date_of_birth,
    city,
    first_name,
    last_name,
    country,
    avatar,
    level,
    gameplay_style,
    forehand,
    backhand,
    net_game,
    insta_link,
    interview_link,
    in_tennis_from,
    job_description,
    height,
    technique,
    psychology,
    power,
    serve,
    behavior,
    premium,
  } = player;

  const statisticPlayer: number = 
    Math.floor((serve + behavior + psychology + technique + net_game) / 5);

  useEffect(() => {
    if(tab){
      setActiveTab(PROFILE_TABS[+tab])
    }
  }, [tab]);

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

  const handleTournamentTypeFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setStatsTabTournamentTypeDropdown(parseInt(e.target.value));
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
            backhand={backhand || ''}
            instaLink={insta_link || ''}
          />
        );
      case PROFILE_TABS[1]:
        return (
          <ScheduleTab playerId={player.id} upcomingMatches={upcomingMatches} />
        );
      case PROFILE_TABS[2]:
        return (
          <>
            <TournamentTypeFilter
              tournamentTypeValue={statsTabTournamentType}
              onChange={handleTournamentTypeFilterChange}
            />
            <MatchesHistoryTab
              playerId={player.id}
              playedMatches={playedMatches.filter((v) =>
                statsTabTournamentType !== 999
                  ? v.tournament.tournament_type === statsTabTournamentType
                  : true
              )}
            />
          </>
        );
      case PROFILE_TABS[3]:
        return (
          <>
            <TournamentTypeFilter
              tournamentTypeValue={statsTabTournamentType}
              onChange={handleTournamentTypeFilterChange}
            />
            {statsData && (
              <StatsData
                p1Stats={statsData as any}
                p1Years={
                  in_tennis_from
                    ? calculateYearsFromDate(in_tennis_from) + ''
                    : ''
                }
              />
            )}
          </>
        );
      case PROFILE_TABS[4]:
        const eloChartData = eloChanges
          .filter(
            (v) =>
              (v.change_date as Date) >
              new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 30 * 12) // 12 months
          )
          .sort((a, b) =>
            (a.change_date as Date) > (b.change_date as Date) ? 1 : -1
          )
          .map((v, i) => ({ eloPoints: v.new_elo_points }));

        return (
          <div className={styles.specs}>
            <div className={styles.inputRow}>
              <p className={styles.inputValue}>
                {'Мощь '}<span className={styles.percent}>{power}%</span>
              </p>
              <input
                disabled
                className={styles.percentInput}
                type="range"
                max={100}
                min={0}
                defaultValue={power as any}
              />
              <p className={styles.shakes}>
                {'Кач '}<span className={styles.percent}>{100 - (power || 0)}%</span>
              </p>
            </div>
            {[
              ['Техника', technique],
              ['Игра на сетке', net_game],
              ['Подача', serve],
              ['Психология', psychology],
              ['Поведение', behavior],
            ].map(([k, v]) => (
              <div key={k} className={styles.inputRow}>
                <p className={styles.inputValue}>
                  {k} <span className={styles.percent}>{v}%</span>
                </p>
                <input
                  disabled
                  className={styles.percentInput}
                  type="range"
                  max={100}
                  min={0}
                  defaultValue={v as any}
                />
              </div>
            ))}
            <div className={styles.eloChartContainer}>
              <p className={styles.chartName}>График изменения рейтинга эло</p>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  width={730}
                  height={250}
                  data={eloChartData}
                  margin={{ top: 25, right: 30 }}
                >
                  <defs>
                    <linearGradient id="colorAqua" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4cc4d1" stopOpacity={1} />
                      <stop offset="95%" stopColor="#4cc4d1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    label="Последние 12 месяцев"
                    tick={false}
                    stroke="#fff"
                  />
                  <YAxis
                    tickCount={15}
                    domain={['dataMin - 200', 'dataMax + 200']}
                    dataKey="eloPoints"
                    stroke="#fff"
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Area
                    type="monotone"
                    dataKey="eloPoints"
                    stroke="#4cc4d1"
                    fillOpacity={1}
                    fill="url(#colorAqua)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      case PROFILE_TABS[5]:
        return digests.length > 0 ? (
          digests.map((d) => (
            <Link key={d.id} href={`/digests/${d.id}`}>
              <a className={styles.digestLinkEl}>
                <DigestListEl
                  title={d.title || ''}
                  date={d.date || undefined}
                />
              </a>
            </Link>
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
    router.push({ pathname: router.asPath.split("?")[0], query: {tab: value}})
  };

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader
        avatarUrl={avatar || ''}
        name={first_name + ' ' + last_name}
        level={LEVEL_NUMBER_VALUES[(level as any)?.toString()]}
        points={eloPoints || undefined}
        tournamentsWins={(statsData as any)?.tournaments_wins}
        tournamentsFinals={(statsData as any)?.tournaments_finals}
        isPremium={!!premium}
        interviewLink={interview_link || ''}
        statisticPlayer={statisticPlayer}
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
  avatarUrl: string;
  name: string;
  level: string;
  points?: number;
  tournamentsWins?: number;
  tournamentsFinals?: number;
  isPremium?: boolean;
  interviewLink?: string;
  statisticPlayer?: number;
}

const ProfileHeader = ({
  avatarUrl,
  name,
  level,
  points,
  isPremium = false,
  tournamentsWins,
  tournamentsFinals,
  interviewLink,
  statisticPlayer
}: IProfileHeaderProps) => {
  const [isStarActive, setStarActiveStatus] = useState(false);
  const handleStarClick = () => {
    if (!isStarActive) {
      setStarActiveStatus(true);
    }
  };

  useEffect(() => {
    let timeout = setTimeout(() => {
      if (isStarActive) {
        setStarActiveStatus(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isStarActive]);

  return (
    <div
      className={styles.profileHeader}
      style={{
        background: `url(${avatarUrl || DEFAULT_PROFILE_IMAGE}) center top / cover`,
      }}
    >
      {isPremium && (
        <div
          onClick={handleStarClick}
          className={cl(styles.premium, isStarActive && styles.open)}
        >
          <AiFillStar />
          {isStarActive && (
            <div className={styles.premiumMessage}>
              {/* should be in sync with database slug field of vip page */}
              <Link href="/other/vip-igroki">
                Игрок из списка &quot;VIP&quot;
              </Link>
            </div>
          )}
        </div>
      )}
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <div className={styles.infoContainer}>
          <div className={styles.achievements}>
            <div className={styles.rank}>
              <span className={styles.positionName}>{level}</span>
            </div>
            <div className={styles.medal}>
              <FaMedal color="yellow" />
              {` ${tournamentsWins || 0}`}
            </div>
            <div className={styles.medal}>
              <FaMedal color="lightgrey" />
              {` ${tournamentsFinals || 0}`}
            </div>
            {
              interviewLink && (
                <Link href={interviewLink}>
                    <FiYoutube className={styles.interviewLink} />
                </Link>
              )
            }
          </div>
          <span 
            className={styles.statistics}>
            {statisticPlayer ?? 0}%
          </span>
          <span className={styles.elo}>{points}</span>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const players = await prisma.player.findMany();
  if (!players) {
    return null;
  }

  return {
    paths: [],
    // paths: players.map(({ id }) => ({ params: { pid: `${id}` } })),
    fallback: 'blocking',
  };
};

export const getStaticProps = async (ctx: NextPageContext) => {
  // @ts-ignore
  const id = parseInt(ctx.params.pid as string, 10);

  if (!id) {
    return {
      notFound: true,
    };
  }

  const player = await prisma.player.findUnique({
    where: {
      id,
    },
  });

  const eloPoints = await prisma.player_elo_ranking.findUnique({
    where: {
      player_id: id,
    },
  });

  const eloChanges = await prisma.elo_ranking_change.findMany({
    where: {
      player_id: id,
    },
  });

  const digests = await prisma.digest.findMany({
    where: {
      mentioned_players_ids: {
        // @ts-ignore
        has: parseInt(ctx.params.pid as string, 10),
      },
    },
  });

  return {
    props: {
      player,
      digests: digests.reverse(),
      eloPoints: eloPoints?.elo_points,
      eloChanges,
    },
    revalidate: 600, // sec
  };
};

export default SingleProfilePage;
