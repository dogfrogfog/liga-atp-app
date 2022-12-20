import { useState, ChangeEvent, useEffect, useMemo } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import { tournament as TournamentT } from '@prisma/client';
import { format } from 'date-fns';

import Tabs from 'ui-kit/Tabs';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import SearchInput from 'components/SearchInput';
import TournamentListItem from 'components/TournamentListItem';
import { TOURNAMENT_STATUS_NUMBER_VALUES } from 'constants/values';
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

  const { active, recording, finished } = useMemo(
    () =>
      tournaments.reduce(
        (acc, v) => {
          if (v.status === 1) {
            acc.recording.push(v);
          }
          if (v.status === 2) {
            acc.active.push(v);
          }
          if (v.status === 3 || v.is_finished) {
            acc.finished.push(v);
          }
          return acc;
        },
        {
          active: [] as TournamentT[],
          recording: [] as TournamentT[],
          finished: [] as TournamentT[],
        }
      ),
    [tournaments]
  );

  const activeTabContent = (() => {
    let filteredTournaments: TournamentT[];
    switch (activeTab) {
      case TOURNAMENT_TABS[0]:
        filteredTournaments = active;
        break;
      case TOURNAMENT_TABS[1]:
        filteredTournaments = recording;
        break;
      case TOURNAMENT_TABS[2]:
        filteredTournaments = finished;
        break;
      default:
        filteredTournaments = [];
    }

    return tournaments.length === 0 ? (
      <NotFoundMessage message="В категории пока нет турниров" />
    ) : (
      <>
        {filteredTournaments.map((v) => (
          <Link key={v.id} href={'/tournaments/' + v.id}>
            <span>
              <TournamentListItem
                name={v.name || 'tbd'}
                status={
                  v.status ? TOURNAMENT_STATUS_NUMBER_VALUES[v.status] : 'tbd'
                }
                startDate={
                  v.start_date
                    ? format(new Date(v.start_date), 'dd.MM.yyyy')
                    : 'tbd'
                }
                winnerName={
                  v.status === 3 || v.is_finished ? '<имя победителя>' : ''
                }
              />
            </span>
          </Link>
        ))}
      </>
    );
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
      <p className={styles.listTitle}>Турниры </p>
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
