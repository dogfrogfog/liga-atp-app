import { useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import { PrismaClient, tournament as TournamentT } from '@prisma/client';
import { format } from 'date-fns';

import Tabs from 'ui-kit/Tabs';
import TournamentListItem from 'components/TournamentListItem';
import Schedule from 'components/tournamentTabs/Schedule';
import PlayersList from 'components/tournamentTabs/PlayersList';
import Download from 'components/tournamentTabs/Download';
import { TOURNAMENT_STATUS_NUMBER_VALUES } from 'constants/values';
import styles from 'styles/Tournament.module.scss';

const TOURNAMENT_TAB = ['Расписание', 'Список игроков', 'Скачать сетку'];

const TournamentPage: NextPage<{ tournament: TournamentT }> = ({
  tournament,
}) => {
  const [activeTab, setActiveTab] = useState(TOURNAMENT_TAB[0]);

  const activeTabContent = (() => {
    switch (activeTab) {
      case TOURNAMENT_TAB[0]:
        return <Schedule />;
      case TOURNAMENT_TAB[1]:
        return <PlayersList />;
      case TOURNAMENT_TAB[2]:
        return <Download />;
      default:
        return null;
    }
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(TOURNAMENT_TAB[value]);
  };

  return (
    <div className={styles.сontainer}>
      <div className={styles.header}>
        <TournamentListItem
          className={styles.tournamentItem}
          name={tournament.name || ''}
          status={
            tournament.status
              ? TOURNAMENT_STATUS_NUMBER_VALUES[tournament.status]
              : 'tbd'
          }
          startDate={
            tournament.start_date
              ? format(new Date(tournament.start_date), 'dd.MM.yyyy')
              : 'tbd'
          }
        />
      </div>
      <section className={styles.tabsContainer}>
        <Tabs
          tabNames={TOURNAMENT_TAB}
          activeTab={activeTab}
          onChange={handleTabChange}
        />
        {activeTabContent}
      </section>
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const prisma = new PrismaClient();

  const tournament = await prisma.tournament.findUnique({
    where: {
      id: parseInt(ctx.query.pid as string),
    },
  });

  return {
    props: {
      tournament,
    },
  };
};

export default TournamentPage;
