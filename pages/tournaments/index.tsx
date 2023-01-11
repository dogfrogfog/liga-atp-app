import { useState, ChangeEvent, useEffect, useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { tournament as TournamentT } from '@prisma/client';
import { format, startOfISOWeek } from 'date-fns';
import cl from 'classnames';

import Tabs from 'ui-kit/Tabs';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import TournamentListItem from 'components/TournamentListItem';
import { TOURNAMENT_STATUS_NUMBER_VALUES } from 'constants/values';
import { getTournaments } from 'services/tournaments';
import PageTitle from 'ui-kit/PageTitle';
import styles from '../../styles/Tournaments.module.scss';

const TOURNAMENT_TABS = ['Идут сейчас', 'Запись в новые', 'Прошедшие'];
const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;

const now = new Date();
const TournamentsPage: NextPage = () => {
  const [tournaments, setTournaments] = useState<TournamentT[]>([]);
  const [activeTab, setActiveTab] = useState(TOURNAMENT_TABS[0]);
  const [weekFilterIndex, setWeekFilterIndex] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchWrapper = async () => {
      const res = await getTournaments();

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
    switch (activeTab) {
      case TOURNAMENT_TABS[0]:
        if (active.length === 0) {
          return <NotFoundMessage message="Нет доступных турниров" />;
        }

        return active.map((v) => (
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
        ));
      case TOURNAMENT_TABS[1]:
        if (recording.length === 0) {
          return <NotFoundMessage message="Нет доступных турниров" />;
        }

        let weeksFilterData: {
          weekNumber: number;
          startDateStr: string;
          endDateStr: string;
        }[] = [];
        const firstWeekNumber = parseInt(format(now, 'I'));

        let filteredTournaments: TournamentT[] = [];
        // 4 is number of weeks available in filter
        for (let i = 0; i < 4; i++) {
          const skipWeeks = i * 7 * DAY_IN_MILLISECONDS;
          const tennisWeekStart =
            startOfISOWeek(now).getTime() + skipWeeks + DAY_IN_MILLISECONDS * 3;
          const tennisWeekEnd =
            startOfISOWeek(now).getTime() +
            skipWeeks +
            DAY_IN_MILLISECONDS * 10;

          if (weekFilterIndex === i) {
            filteredTournaments = recording.filter((v) => {
              if (!v.start_date) {
                return false;
              }

              const tournamentStartTime = new Date(v.start_date).getTime();

              if (
                tournamentStartTime > tennisWeekStart &&
                tournamentStartTime < tennisWeekEnd
              ) {
                return true;
              }
            });
          }

          weeksFilterData.push({
            weekNumber: firstWeekNumber + i,
            startDateStr: format(tennisWeekStart, 'dd.MM'),
            endDateStr: format(tennisWeekEnd, 'dd.MM'),
          });
        }

        return (
          <div>
            <div className={styles.weekFiltersContainer}>
              {weeksFilterData.map(
                ({ startDateStr, endDateStr, weekNumber }, i) => (
                  <button
                    key={startDateStr}
                    onClick={() => setWeekFilterIndex(i)}
                    className={cl(
                      styles.week,
                      weekFilterIndex === i ? styles.active : ''
                    )}
                  >
                    <p className={styles.weekNumber}>{weekNumber} неделя</p>
                    <p className={styles.weekRange}>
                      <i>
                        {startDateStr}-{endDateStr}
                      </i>
                    </p>
                  </button>
                )
              )}
            </div>
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((v) => (
                <Link key={v.id} href={'/tournaments/' + v.id}>
                  <span>
                    <TournamentListItem
                      name={v.name || 'tbd'}
                      status={
                        v.status
                          ? TOURNAMENT_STATUS_NUMBER_VALUES[v.status]
                          : 'tbd'
                      }
                      startDate={
                        v.start_date
                          ? format(new Date(v.start_date), 'dd.MM.yyyy')
                          : 'tbd'
                      }
                      winnerName={
                        v.status === 3 || v.is_finished
                          ? '<имя победителя>'
                          : ''
                      }
                    />
                  </span>
                </Link>
              ))
            ) : (
              <NotFoundMessage message="Нет доступных турниров" />
            )}
          </div>
        );
      case TOURNAMENT_TABS[2]:
        if (finished.length === 0) {
          return <NotFoundMessage message="Нет доступных турниров" />;
        }

        return (
          <>
            <div className={styles.finishedTournamentsFilters}>
              <div className={styles.checkbox}>
                <input type="checkbox" />
                <span>Даблс</span>
              </div>
            </div>
            {finished.map((v) => (
              <Link key={v.id} href={'/tournaments/' + v.id}>
                <span>
                  <TournamentListItem
                    name={v.name || 'tbd'}
                    status={
                      v.status
                        ? TOURNAMENT_STATUS_NUMBER_VALUES[v.status]
                        : 'tbd'
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
    }

    return null;
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(TOURNAMENT_TABS[value]);
  };

  const filterFn = (inputValue: string) => (t: TournamentT) =>
    (t?.name as string).toLowerCase().includes(inputValue);

  // фильтрация турниров в активном табе
  const inputSuggestions = (() => {
    switch (activeTab) {
      case TOURNAMENT_TABS[0]: {
        return active;
      }
      case TOURNAMENT_TABS[1]: {
        return recording;
      }
      case TOURNAMENT_TABS[2]: {
        return finished;
      }
      default: {
        return [];
      }
    }
  })();

  const onSuggestionClick = (t: TournamentT) => {
    router.push(`tournaments/${t.id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.searchInputContainer}>
        <SuggestionsInput
          filterFn={filterFn}
          suggestions={inputSuggestions}
          placeholder="Введите название турнира"
          onSuggestionClick={onSuggestionClick}
        />
      </div>
      <PageTitle>Турниры</PageTitle>
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
