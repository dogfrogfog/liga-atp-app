import { useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import {
  PrismaClient,
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
import PlayersList from 'components/PlayersList';
import {
  TOURNAMENT_STATUS_NUMBER_VALUES,
  GROUPS_DRAW_TYPES,
} from 'constants/values';
import styles from 'styles/Tournament.module.scss';
import { IBracketsUnit } from 'components/admin/TournamentDraw';
import { addPlayerToTheTournament } from 'services/tournaments';

const TOURNAMENT_TABS = ['Расписание', 'Список игроков'];

const TournamentPage: NextPage<{
  brackets: IBracketsUnit[][];
  tournament: TournamentT;
  tournamentMatches: MatchT[];
  registeredPlayers: PlayerT[];
}> = ({ tournament, tournamentMatches, brackets, registeredPlayers }) => {
  const [activeTab, setActiveTab] = useState(TOURNAMENT_TABS[0]);
  const [isAddPlayerModalOpen, setAddPlayerModalStatus] = useState(false);
  const [isPlayerLoading, setPlayerLoadingStatus] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const activeTabContent = (() => {
    switch (activeTab) {
      case TOURNAMENT_TABS[0]:
        return brackets ? (
          <Schedule
            hasGroups={
              tournament.draw_type
                ? GROUPS_DRAW_TYPES.includes(tournament.draw_type)
                : false
            }
            isDoubles={!!tournament.is_doubles}
            brackets={brackets}
            tournamentMatches={tournamentMatches}
            registeredPlayers={registeredPlayers}
          />
        ) : (
          <NotFoundMessage message="Сетка не сформирована" />
        );
      case TOURNAMENT_TABS[1]:
        return <PlayersList players={registeredPlayers} />;
      default:
        return null;
    }
  })();

  const handleTabChange = (_: any, value: number) => {
    setActiveTab(TOURNAMENT_TABS[value]);
  };

  const isFinished = tournament.is_finished || tournament.status === 3;

  const handleDownloadClick = () => {};
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

      console.log('concat');

      newUnregisteredPlayers = prevUnregisteredPlayers.concat([cleanData]);
    } else {
      console.log('new');
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
        {!isFinished ? (
          <>
            {tournament.status === 2 ? (
              <button
                onClick={handleDownloadClick}
                className={styles.nearTabButton}
              >
                <AiOutlineDownload />
              </button>
            ) : (
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
        ) : (
          <div>Турнир прошел</div>
        )}
        {isAddPlayerModalOpen && (
          <>
            <div className={styles.addPlayerForm}>
              <p className={styles.formTitle}>Форма регистрации игрока</p>
              {!isPlayerLoading ? (
                <form onSubmit={handleSubmit(submitPlayerRegistration)}>
                  <InputWithError errorMessage={errors.first_name?.message}>
                    <input
                      className={styles.input}
                      placeholder="Имя"
                      {...register('first_name', { required: true })}
                    />
                  </InputWithError>
                  <InputWithError errorMessage={errors.last_name?.message}>
                    <input
                      className={styles.input}
                      placeholder="Фамилия"
                      {...register('last_name', { required: true })}
                    />
                  </InputWithError>
                  <InputWithError errorMessage={errors.phone?.message}>
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
                <LoadingSpinner />
              )}
            </div>
            <div
              onClick={toggleAddPlayerModal}
              className={styles.addPlayerFormOverlay}
            ></div>
          </>
        )}
      </section>
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const tournament = await prisma.tournament.findUnique({
    where: {
      id: parseInt(ctx.query.pid as string, 10),
    },
    include: {
      match: true,
    },
  });

  const { match, ...rest } = tournament || {};

  const brackets = tournament?.draw
    ? JSON.parse(tournament.draw)?.brackets
    : null;
  const registeredPlayersIds = tournament?.players_order
    ? JSON.parse(tournament.players_order)?.players
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
  };
};

export default TournamentPage;
