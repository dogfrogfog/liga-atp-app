import {
  useState,
  ChangeEvent,
  useMemo,
  memo,
  Dispatch,
  SetStateAction, useEffect, useCallback,
} from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { tournament as TournamentT, player as PlayerT } from '@prisma/client';
import {
  format,
  startOfWeek,
  addDays,
  endOfWeek,
  addWeeks,
  getWeek,
} from 'date-fns';
import cl from 'classnames';
import useTournaments from 'hooks/useTournaments';
import usePlayedTournaments from 'hooks/usePlayedTournaments';
import Tabs from 'ui-kit/Tabs';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import TournamentListItem from 'components/TournamentListItem';
import TournamentTypeFilter from 'components/TournamentTypeFilter';
import {
  TOURNAMENT_STATUS_NUMBER_VALUES,
  PLAYED_TOURNAMENT_PAGE_SIZE,
} from 'constants/values';
import PageTitle from 'ui-kit/PageTitle';
import styles from '../../styles/Tournaments.module.scss';
import getTournamentWinners from 'utils/getTournamentWinners';
import { prisma } from 'services/db';

const TOURNAMENT_TABS = ['Идут сейчас', 'Прошедшие'];

const filterFn = (inputValue: string) => (t: TournamentT) =>
  (t?.name as string).toLowerCase().includes(inputValue);

type TournamentsPageProps = {
  activeTournaments: TournamentT[];
  openToRegistrationTournaments: TournamentT[];
  players: PlayerT[];
};

const TournamentsPage: NextPage<TournamentsPageProps> = ({
  activeTournaments,
  openToRegistrationTournaments,
  players,
}) => {
  const [activeTab, setActiveTab] = useState(TOURNAMENT_TABS[0]);
  const [weekFilterIndex, setWeekFilterIndex] = useState(0);
  const [finishedTournamentsType, setFinishedTournamentsType] = useState(999);
  const [playedTournamentsPage, setPlayedTournamentsPage] = useState(1);
  const [scrollTournament, setScrollTournament] = useState<number>(0);

  const { tournaments, isLoading } = useTournaments();
  const router = useRouter();
  const {tournament, type} = router.query

  useEffect(() => {
    switch (tournament) {
      case 'new': {
        setActiveTab(TOURNAMENT_TABS[0]);
        break;
      }
      case 'finished': {
        setActiveTab(TOURNAMENT_TABS[1]);
        break;
      }
    }
  }, [tournament])

  useEffect(() => {
    if(type){
      setFinishedTournamentsType(+type)
    }

  }, [type])

  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollTournament');
    if (savedScrollPosition) {
      setScrollTournament(parseInt(savedScrollPosition, 10));
    }
    window.scrollTo(0, scrollTournament);
  }, [scrollTournament]);

  const handleScroll = useCallback((id: number) => {
    sessionStorage.setItem('scrollTournament', window.pageYOffset.toString());
    router.push(`/tournaments/${id}`);
  }, [router])

  const activeTabContent = (() => {
    switch (activeTab) {
      case TOURNAMENT_TABS[0]:
        if (activeTournaments.length === 0) {
          return <NotFoundMessage message="Нет доступных турниров" />;
        }

        return activeTournaments.map((v) => (
          <div key={v.id} className={styles.link} onClick={() => handleScroll(v.id)}>
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
          </div>
        ));
      case TOURNAMENT_TABS[2]: //TODO: when uncomment TOURNAMENT_TABS replace case 1 and 2
        const now = Date.now();
        let filteredTournaments: TournamentT[] = [];

        // since we filtering only upcoming tournaments with open registration
        // first filter option should be start of next tennis week
        // tennis week starts on Thursday and finishes on Wednesday
        const filterFirstWeekStartDate = startOfWeek(addWeeks(now, 1), {
          weekStartsOn: 4,
        });
        const filterWeekOptions = [] as any[];

        // 4 is number of weeks available in filter
        for (let i = 0; i < 4; i++) {
          const weekStartDate = addDays(filterFirstWeekStartDate, i * 7);
          const weekEndDate = endOfWeek(weekStartDate, { weekStartsOn: 4 });

          filterWeekOptions.push({
            startDate: format(weekStartDate, 'dd.MM'),
            endDate: format(weekEndDate, 'dd.MM'),
            week: getWeek(weekStartDate),
          });

          if (weekFilterIndex === i) {
            filteredTournaments = openToRegistrationTournaments.filter((v) => {
              if (!v.start_date) {
                return false;
              }

              const tournamentStartTime = new Date(v.start_date);
              if (
                tournamentStartTime > weekStartDate &&
                tournamentStartTime < weekEndDate
              ) {
                return true;
              }
            });
          }
        }

        return (
          <div>
            <div className={styles.weekFiltersContainer}>
              {filterWeekOptions.map(({ startDate, endDate, week }, i) => (
                <button
                  key={startDate}
                  onClick={() => setWeekFilterIndex(i)}
                  className={cl(
                    styles.week,
                    weekFilterIndex === i ? styles.active : ''
                  )}
                >
                  <p className={styles.weekNumber}>{week} неделя</p>
                  <p className={styles.weekRange}>
                    <i>
                      {startDate}-{endDate}
                    </i>
                  </p>
                </button>
              ))}
            </div>
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((v) => (
                  <div key={v.id} className={styles.link} onClick={() => handleScroll(v.id)}>
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
                  </div>
              ))
            ) : (
              <NotFoundMessage message="Нет доступных турниров" />
            )}
          </div>
        );
      case TOURNAMENT_TABS[1]: //TODO: when uncomment TOURNAMENT_TABS replace case 1 and 2
        const handleLevelChange = (e: ChangeEvent<HTMLSelectElement>) => {
          setFinishedTournamentsType(parseInt(e.target.value, 10));
          router.push({ pathname: router.pathname, query: {tournament: router.query.tournament, type: e.target.value}})
        };

        const pages = [];
        for (let i = 0; i < playedTournamentsPage; i += 1) {
          pages.push(
            <FinishedTournamentsList
              key={i}
              players={players}
              playedTournamentsPage={i + 1}
              finishedTournamentsType={finishedTournamentsType}
              isLastPage={i + 1 === playedTournamentsPage}
              setPlayedTournamentsPage={setPlayedTournamentsPage}
            />
          );
        }

        return (
          <>
            <TournamentTypeFilter
              onChange={handleLevelChange}
              tournamentTypeValue={finishedTournamentsType}
            />
            {pages}
          </>
        );
    }

    return null;
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(TOURNAMENT_TABS[value]);
    switch (value) {
      case 0: {
        router.push({ pathname: router.pathname, query: {tournament: 'new'}})
        break;
      }
      case 1: {
        router.push({ pathname: router.pathname, query: {tournament: 'finished'}})
        break;
      }
    }
  };

  const onSuggestionClick = (t: TournamentT) => {
    router.push(`tournaments/${t.id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.searchInputContainer}>
        <SuggestionsInput
          filterFn={filterFn}
          suggestions={tournaments}
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
      {isLoading ? <LoadingSpinner /> : activeTabContent}
    </div>
  );
};

type FinishedTournamentsListProps = {
  playedTournamentsPage: number;
  finishedTournamentsType: number;
  isLastPage: boolean;
  players: PlayerT[];
  setPlayedTournamentsPage: Dispatch<SetStateAction<number>>;
};

const FinishedTournamentsList = memo(
  ({
    playedTournamentsPage,
    finishedTournamentsType,
    isLastPage,
    players,
    setPlayedTournamentsPage,
  }: FinishedTournamentsListProps) => {
    const { playedTournaments, isLoading } = usePlayedTournaments(playedTournamentsPage);
    const [scrollTournament, setScrollTournament] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
      const savedScrollPosition = sessionStorage.getItem('scrollTournament');
      if (savedScrollPosition) {
        setScrollTournament(parseInt(savedScrollPosition, 10));
      }
      window.scrollTo(0, scrollTournament);
    }, [scrollTournament]);

    const handleScroll = useCallback((id: number) => {
      sessionStorage.setItem('scrollTournament', window.pageYOffset.toString());
      router.push(`/tournaments/${id}`);
    }, [router])

    const playersMap = useMemo(
      () =>
        players.reduce((acc, p) => {
          acc.set(p.id, p);
          return acc;
        }, new Map<number, PlayerT>()),
      [players]
    );

    const filteredFinishedTournaments = playedTournaments.filter((v) =>
      finishedTournamentsType !== 999
        ? finishedTournamentsType === v.tournament_type
        : true
    );

    if (isLastPage && isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <>
        {filteredFinishedTournaments.map((v) => (
            <div key={v.id} className={styles.link} onClick={() => handleScroll(v.id)}>
              <TournamentListItem
                name={v.name || 'название не определено'}
                status={
                  v.status
                    ? TOURNAMENT_STATUS_NUMBER_VALUES[v.status]
                    : TOURNAMENT_STATUS_NUMBER_VALUES[3]
                }
                startDate={
                  v.start_date
                    ? format(new Date(v.start_date), 'dd.MM.yyyy')
                    : 'дата не определена'
                }
                winnerName={
                  v.status === 3 || v.is_finished
                    ? getTournamentWinners(v, playersMap)
                    : ''
                }
              />
            </div>
        ))}
        {isLastPage &&
          playedTournaments.length === PLAYED_TOURNAMENT_PAGE_SIZE && (
            <div className={styles.loadMoreContainer}>
              <button
                onClick={() => setPlayedTournamentsPage((v) => v + 1)}
                className={styles.loadMore}
              >
                Загрузить еще
              </button>
            </div>
          )}
      </>
    );
  }
);

export const getStaticProps = async () => {
  const players = await prisma.player.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
    },
  });

  const tournaments = await prisma.tournament.findMany({
    where: {
      status: {
        in: [1, 2],
      },
    },
    select: {
      id: true,
      name: true,
      status: true,
      start_date: true,
      is_finished: true,
    },
  });

  let activeTournaments = [];
  let openToRegistrationTournaments = [];
  for (const t of tournaments) {
    if (t.status === 1) {
      openToRegistrationTournaments.push(t);
    } else if (t.status === 2) {
      activeTournaments.push(t);
    }
  }

  return {
    props: {
      players,
      activeTournaments,
      openToRegistrationTournaments,
    },
    revalidate: 600, // sec
  };
};

export default TournamentsPage;
