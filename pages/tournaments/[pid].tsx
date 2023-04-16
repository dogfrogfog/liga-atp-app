import { useState, Fragment, useRef, useMemo } from 'react';
import html2canvas from 'html2canvas';
import type { NextPage } from 'next';
import {
  tournament as TournamentT,
  match as MatchT,
  player as PlayerT,
} from '@prisma/client';
import { format } from 'date-fns';
import { AiOutlineDownload } from 'react-icons/ai';
import { AiOutlineUserAdd } from 'react-icons/ai';
import cl from 'classnames';
import { useForm } from 'react-hook-form';

import { prisma } from 'services/db';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import InputWithError from 'ui-kit/InputWithError';
import NotFoundMessage from 'ui-kit/NotFoundMessage';
import Tabs from 'ui-kit/Tabs';
import TournamentListItem from 'components/TournamentListItem';
import Schedule from 'components/tournamentTabs/Schedule';
import { PlayersList, PlayersListHeader } from 'components/PlayersList';
import {
  TOURNAMENT_STATUS_NUMBER_VALUES,
  GROUPS_DRAW_TYPES,
  DOUBLES_TOURNAMENT_TYPES_NUMBER,
} from 'constants/values';
import styles from 'styles/Tournament.module.scss';
import { IBracketsUnit } from 'components/admin/TournamentDraw';
import { addPlayerToTheTournament } from 'services/tournaments';
import usePlayers from 'hooks/usePlayers';
import useEloPoints from 'hooks/useEloPoints';
import { getRegPlayersIds } from 'utils/parsePlayersOrder';
import LoadingShadow from 'components/LoadingShadow';

const TOURNAMENT_TABS = ['Сетка', 'Список игроков'];

const TournamentPage: NextPage<{
  brackets: IBracketsUnit[][];
  tournament: TournamentT;
  tournamentMatches: MatchT[];
  registeredPlayers: PlayerT[];
}> = ({ tournament, tournamentMatches, brackets, registeredPlayers }) => {
  const downloadImageRef = useRef();

  const { players: allPlayers } = usePlayers();
  const { eloPoints } = useEloPoints();

  const playersRankingsMap = useMemo(
    () =>
      eloPoints.reduce((acc, p) => {
        acc.set(p.player_id as number, p?.elo_points);
        return acc;
      }, new Map<number, number | null>()),
    [eloPoints]
  );

  const [activeTab, setActiveTab] = useState(
    TOURNAMENT_TABS[tournament.status === 1 ? 1 : 0]
  );
  const [isAddPlayerModalOpen, setAddPlayerModalStatus] = useState(false);
  const [isPlayerLoading, setPlayerLoadingStatus] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const isFinished = tournament.is_finished || tournament.status === 3;
  const isDoubles =
    tournament.is_doubles ||
    DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
      tournament.tournament_type as number
    );

  const activeTabContent = (() => {
    switch (activeTab) {
      case TOURNAMENT_TABS[0]:
        // for old tournaments with no brackets data or brackets data in old format
        if (
          tournament.is_finished &&
          (!brackets || (brackets && !Array.isArray(brackets[0])))
        ) {
          const lastMatch = tournamentMatches[tournamentMatches.length - 1];

          let winners = [] as PlayerT[];
          if (isDoubles) {
            const winnersIds = lastMatch.winner_id?.split('012340');

            const playersWhoWin = allPlayers.filter((p) => {
              return winnersIds?.includes(p.id + '');
            });

            winners = playersWhoWin;
          } else {
            const targetPlayer = allPlayers.find(
              (p) => lastMatch.winner_id === p.id + ''
            ) as PlayerT;

            winners = [targetPlayer];
          }

          return (
            <p className={styles.newDrawWinner}>
              {isDoubles ? 'Победители' : 'Победитель(ница)'} турнира:
              <br />
              <br />
              {winners.map(
                (p, i) =>
                  p && (
                    <Fragment key={p.id}>
                      {p?.first_name +
                        ' ' +
                        p?.last_name +
                        `${i + 1 != winners.length ? ' / ' : ''}`}
                    </Fragment>
                  )
              )}
            </p>
          );
        }

        // active recording
        if (tournament.status === 1) {
          return <NotFoundMessage message="Жеребьевка еще не прошла" />;
        }

        // new brackets.draw format
        const lastMatch = isFinished
          ? tournamentMatches.find(
              (v) => v.id === brackets[brackets.length - 1][0].matchId
            )
          : null;
        let winnerName;
        if (!isDoubles) {
          const winner = registeredPlayers.find(
            (v) => v.id + '' === lastMatch?.winner_id
          );

          winnerName = winner
            ? `${(winner.first_name as string)[0]}. ${winner.last_name}`
            : '';
        } else {
          const team1 = [lastMatch?.player1_id, lastMatch?.player3_id];
          const team2 = [lastMatch?.player2_id, lastMatch?.player4_id];

          if (team1.includes(parseInt(lastMatch?.winner_id as string, 10))) {
            winnerName = allPlayers.reduce((acc, p) => {
              if (team1.includes(p.id)) {
                if (acc) {
                  acc += ` / ${(p.first_name as string)[0]}. ${p.last_name}`;
                } else {
                  acc = `${(p.first_name as string)[0]}. ${p.last_name}`;
                }
              }
              return acc;
            }, '');
          }

          if (team2.includes(parseInt(lastMatch?.winner_id as string, 10))) {
            winnerName = allPlayers.reduce((acc, p) => {
              if (team2.includes(p.id)) {
                if (acc) {
                  acc += ` / ${(p.first_name as string)[0]}. ${p.last_name}`;
                } else {
                  acc = `${(p.first_name as string)[0]}. ${p.last_name}`;
                }
              }
              return acc;
            }, '');
          }
        }

        return brackets ? (
          <>
            {isFinished && (
              <p className={styles.newDrawWinner}>
                {isDoubles ? 'Победители' : 'Победитель(ница)'}:
                <br />
                <br />
                {winnerName}
              </p>
            )}
            <Schedule
              ref={downloadImageRef}
              hasGroups={
                tournament.draw_type
                  ? GROUPS_DRAW_TYPES.includes(tournament.draw_type)
                  : false
              }
              isDoubles={isDoubles}
              brackets={brackets}
              tournamentMatches={tournamentMatches}
              registeredPlayers={registeredPlayers}
            />
          </>
        ) : (
          <NotFoundMessage message="Сетка не сформирована" />
        );
      case TOURNAMENT_TABS[1]:
        // for old tournaments with no players data
        if (
          (tournament.status === 3 || tournament.is_finished) &&
          !registeredPlayers
        ) {
          return (
            <NotFoundMessage message="Зарегестрированные игроки недоступны" />
          );
        }

        const playersWithElo = registeredPlayers.map((v) => ({
          ...v,
          elo_points: playersRankingsMap.get(v.id as number) as number,
        }));

        return registeredPlayers.length > 0 ? (
          <>
            <PlayersListHeader />
            <PlayersList players={playersWithElo} />
          </>
        ) : (
          <NotFoundMessage message="Нет зарегестрированных игроков" />
        );
      default:
        return null;
    }
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(TOURNAMENT_TABS[value]);
  };

  const handleDownloadClick = async () => {
    if (downloadImageRef.current) {
      const canvas = await html2canvas(downloadImageRef.current);

      const data = canvas.toDataURL('image/jpg');
      const link = document.createElement('a');

      if (typeof link.download === 'string') {
        link.href = data;
        link.download = 'image.jpg';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        window.open(data);
      }
    }
  };

  const toggleAddPlayerModal = () => {
    setAddPlayerModalStatus((v) => !v);
  };

  const submitPlayerRegistration = async (
    data: { first_name: string; last_name: string; phone?: string } & any
  ) => {
    setPlayerLoadingStatus(true);

    const cleanData = {
      ...data,
      phone: data.phone || undefined,
    };

    let newUnregisteredPlayers;
    if (tournament.unregistered_players) {
      const prevUnregisteredPlayers = JSON.parse(
        tournament.unregistered_players
      );

      newUnregisteredPlayers = prevUnregisteredPlayers.concat([cleanData]);
    } else {
      newUnregisteredPlayers = [cleanData];
    }

    const { isOk } = await addPlayerToTheTournament({
      id: tournament.id,
      unregistered_players: JSON.stringify(newUnregisteredPlayers),
    });

    if (isOk) {
      setAddPlayerModalStatus(false);
      reset();
    }

    setPlayerLoadingStatus(false);
  };

  return (
    <div className={styles.сontainer}>
      <div className={styles.header}>
        <TournamentListItem
          className={styles.tournamentItem}
          name={tournament.name || 'tbd'}
          status={
            tournament.is_finished
              ? TOURNAMENT_STATUS_NUMBER_VALUES[3]
              : TOURNAMENT_STATUS_NUMBER_VALUES[tournament.status as number]
          }
          startDate={
            tournament.start_date
              ? format(new Date(tournament.start_date), 'dd.MM.yyyy')
              : 'tbd'
          }
        />
      </div>
      <section className={styles.tabsContainer}>
        <>
          {/* show only for schedule tab  */}
          {activeTab === TOURNAMENT_TABS[0] && tournament.status === 2 && (
            <button
              onClick={handleDownloadClick}
              className={styles.nearTabButton}
            >
              <AiOutlineDownload />
            </button>
          )}
          {/* show only for players list tab  */}
          {activeTab === TOURNAMENT_TABS[1] && tournament.status === 1 && (
            <button
              onClick={toggleAddPlayerModal}
              className={styles.nearTabButton}
            >
              <AiOutlineUserAdd />
            </button>
          )}
          <Tabs
            tabNames={TOURNAMENT_TABS}
            activeTab={activeTab}
            onChange={handleTabChange}
          />
          {activeTabContent}
        </>
      </section>
      {isAddPlayerModalOpen && (
        <>
          <div className={styles.addPlayerForm}>
            <p className={styles.formTitle}>Форма регистрации игрока</p>
            {!isPlayerLoading ? (
              <form onSubmit={handleSubmit(submitPlayerRegistration)}>
                <InputWithError error={errors.first_name}>
                  <input
                    className={styles.input}
                    placeholder="Имя"
                    {...register('first_name', { required: true })}
                  />
                </InputWithError>
                <InputWithError error={errors.last_name}>
                  <input
                    className={styles.input}
                    placeholder="Фамилия"
                    {...register('last_name', { required: true })}
                  />
                </InputWithError>
                <InputWithError error={errors.phone}>
                  <input
                    className={cl(styles.input, styles.phone)}
                    placeholder="Номер телефона"
                    {...register('phone', {
                      pattern: {
                        value: /^375\d{9}$/,
                        message: 'Некорректный формат (прим. 375291234567)',
                      },
                    })}
                  />
                </InputWithError>
                <span className={styles.phoneNote}>
                  если вы впервые учавствуете в турнире - заполните поле{' '}
                  <b>номер телефона</b>
                </span>
                <input
                  className={cl(styles.input, styles.submit)}
                  type="submit"
                  value="Записаться"
                />
              </form>
            ) : (
              <>
                <LoadingShadow />
                <LoadingSpinner />
              </>
            )}
          </div>
          <div
            onClick={toggleAddPlayerModal}
            className={styles.addPlayerFormOverlay}
          ></div>
        </>
      )}
    </div>
  );
};

export const getStaticPaths = async () => {
  const tournaments = await prisma.tournament.findMany();
  if (!tournaments) {
    return null;
  }

  return {
    paths: [],

    // paths: tournaments.map(({ id }) => ({ params: { pid: `${id}` } })),
    fallback: 'blocking',
  };
};

export const getStaticProps = async (ctx: any) => {
  const id = parseInt(ctx.params.pid as string, 10);

  if (!id) {
    return {
      notFound: true,
    };
  }

  const tournament = await prisma.tournament.findUnique({
    where: {
      id,
    },
    include: {
      match: true,
    },
  });

  const { match, ...rest } = tournament || {};
  const isDoubles = !!DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
    tournament?.tournament_type as number
  );

  const brackets = tournament?.draw
    ? JSON.parse(tournament.draw)?.brackets
    : null;
  const registeredPlayersIds = tournament?.players_order
    ? getRegPlayersIds(JSON.parse(tournament.players_order), isDoubles)
    : null;

  let registeredPlayers = [] as PlayerT[];
  if (registeredPlayersIds) {
    registeredPlayers = await prisma.player.findMany({
      where: {
        id: {
          in: registeredPlayersIds,
        },
      },
    });
  }

  return {
    props: {
      tournament: rest,
      tournamentMatches: match,
      brackets,
      registeredPlayers,
    },
    revalidate: 600, // 10 min
  };
};

export default TournamentPage;
