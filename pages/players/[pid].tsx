import { useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import Link from 'next/link';
import { FaMedal } from 'react-icons/fa';
import { FaUserAlt } from 'react-icons/fa';
import type {
  player as PlayerT,
  digest as DigestT,
  elo_ranking_change,
} from '@prisma/client';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

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
import calculateYearsFromDate from 'utils/calculateYearsFromDate';
import styles from 'styles/Profile.module.scss';

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
  const [statsTabTournamentType, setStatsTabTournamentTypeDropdown] =
    useState(999);

  const { matches } = useMatches(player.id);
  const { statsData } = useStats(
    player.id,
    statsTabTournamentType === 999 ? undefined : statsTabTournamentType
  );

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
    beckhand,
    insta_link,
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
            gameplayStyle={gameplay_style || ''}
            selectedLvl={statsTabTournamentType}
            setSelectedLvl={setStatsTabTournamentTypeDropdown}
            statsData={statsData as any}
          />
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
            {[
              ['Техника', technique],
              ['Тактика', tactics],
              ['Мощь', power],
              ['Кач', shakes],
              ['Подача', serve],
              ['Поведение', behaviour],
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
            <br />
            <p>График изменения рейтинга эло</p>
            <div style={{ height: 420, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  width={500}
                  height={300}
                  data={eloChartData}
                  margin={{
                    top: 50,
                    right: 30,
                  }}
                >
                  <XAxis
                    label="Последние 12 месяцев"
                    tick={false}
                    stroke="#fff"
                  />
                  <YAxis
                    tickCount={15}
                    domain={[0, 'dataMax + 200']}
                    dataKey="eloPoints"
                    stroke="#fff"
                  />
                  <Line
                    type="monotone"
                    dataKey="eloPoints"
                    stroke="#4cc4d1"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
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
  };

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader
        avavarUrl={avatar || ''}
        name={first_name + ' ' + last_name}
        level={LEVEL_NUMBER_VALUES[(level as any)?.toString()]}
        points={eloPoints || undefined}
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
  points?: number;
  tournamentsWins?: number;
  tournamentsFinals?: number;
}

const ProfileHeader = ({
  avavarUrl,
  name,
  level,
  points,
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
  const id = parseInt(ctx.query.pid as string, 10);

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
        has: parseInt(ctx.query.pid as string, 10),
      },
    },
  });

  return {
    props: {
      player,
      digests,
      eloPoints: eloPoints?.elo_points,
      eloChanges,
    },
  };
};

export default SingleProfilePage;
