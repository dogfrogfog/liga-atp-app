import { useState, ChangeEvent, useEffect } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { tournament as TournamentT } from '@prisma/client';

import Tabs from 'ui-kit/Tabs';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import SearchInput from 'components/SearchInput';
import { getTournaments } from 'services/tournaments';
import styles from '../../styles/Tournaments.module.scss';

const TOURNAMENT_TABS = ['Идут сейчас', 'Запись в новые', 'Прошедшие'];

const TournamentsPage: NextPage = () => {
  const [tournaments, setTournaments] = useState<TournamentT[]>([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(TOURNAMENT_TABS[0]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    const fetchWrapper = async () => {
      const res = await getTournaments({ pageIndex: 0, pageSize: 20 });

      if (res.isOk) {
        setTournaments(res.data as TournamentT[]);
      }
    };

    fetchWrapper();
  }, []);

  const activeTabContent = (() => {
    switch (activeTab) {
      case TOURNAMENT_TABS[0]:
        return tournaments.length === 0 ? (
          <NotFoundMessage message="Результаты по вашему запросу не найдены" />
        ) : (
          <>
            <p className={styles.listTitle}>Турниры </p>
            {tournaments.map((v, index) => (
              <Link key={index} href={'/tournaments/' + index}>
                <span>{v.name}</span>
                {/* <div className={styles.tournamentListItem}>
              <div>
                <span>{title}</span>
                {status && <span className={styles.status}>{status}</span>}
              </div>
              <div>
                <span>{date}</span>
                {winners && <span>{winners}</span>}
              </div>
            </div> */}
              </Link>
            ))}
          </>
        );
      case TOURNAMENT_TABS[1]:
        return null;
      case TOURNAMENT_TABS[2]:
        return null;
    }
  })();

  const submitSearch = async () => {
    const res = await getTournaments({ pageIndex: 1, pageSize: 20 });

    if (res.isOk) {
      setTournaments(res.data as TournamentT[]);
    }
  };

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(TOURNAMENT_TABS[value]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SearchInput
          value={search}
          handleChange={handleSearch}
          submitSearch={submitSearch}
        />
      </div>
      <Tabs
        activeTab={activeTab}
        tabNames={TOURNAMENT_TABS}
        onChange={handleTabChange}
      />
      {activeTabContent}
    </div>
  );
};

export default TournamentsPage;
