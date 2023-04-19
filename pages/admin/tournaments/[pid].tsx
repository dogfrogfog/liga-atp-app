import { useCallback, useState } from 'react';
import type { NextPage, NextPageContext } from 'next';
import cl from 'classnames';
import { tournament as TournamentT, match as MatchT } from '@prisma/client';
import { prisma } from 'services/db';
import { MultiSelect, Option } from 'react-multi-select-component';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';

import { DEFAULT_MODAL } from 'constants/values';
import PageTitle from 'ui-kit/PageTitle';
import Modal from 'ui-kit/Modal';
import LoadingShadow from 'components/LoadingShadow';
import TournamentDraw, { IBracketsUnit } from 'components/admin/TournamentDraw';
import TournamentForm from 'components/admin/TournamentForm';
import MatchForm from 'components/admin/MatchForm';
import {
  updateTournament,
  deleteSelectedTournament,
} from 'services/tournaments';
import { createMatch, updateMatch } from 'services/matches';
import usePlayers from 'hooks/usePlayers';
import useTournaments from 'hooks/useTournaments';
import useSingleTournament from 'hooks/useSingleTournament';
import { playersToMultiSelect, multiSelectToIds } from 'utils/multiselect';
import { getRegPlayersIds } from 'utils/parsePlayersOrder';
import { DOUBLES_TOURNAMENT_TYPES_NUMBER } from 'constants/values';
import styles from './AdminSingleTournamentPape.module.scss';
import { useRouter } from 'next/router';

type AdminSingleTournamentPapeProps = {
  initialTournamentValues: TournamentT & { match: MatchT[] };
};

const AdminSingleTournamentPape: NextPage<AdminSingleTournamentPapeProps> = ({
  initialTournamentValues: {
    match: initialMatches,
    ...initialTournamentValues
  },
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // when match already exists we save passed match to have default values to form
  // when match is not exists and we creating new match and updating tournament draw property ..
  // .. so we same stage index(si) and match index(mi)
  const [editingMatchData, setEditingMatchData] = useState<{
    newMatch?: MatchT;
    si?: number;
    mi?: number;
    isGroupMatch?: boolean;
  }>();
  const [newSelectedPlayers, setNewSelectedPlayers] = useState<Option[]>([]);
  const [modalStatus, setModalStatus] = useState(DEFAULT_MODAL);

  const { players } = usePlayers();
  const { mutate: mutateTournaments } = useTournaments();
  const { mutate, tournament } = useSingleTournament(
    initialTournamentValues.id,
    { ...initialTournamentValues, match: initialMatches }
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: tournament?.name,
      address: tournament?.address,
      city: tournament?.city,
      draw_type: tournament?.draw_type,
      tournament_type: tournament?.tournament_type,
      surface: tournament?.surface,
      status: tournament?.status,
      start_date: tournament?.start_date
        ? (format(new Date(tournament?.start_date), 'yyyy-MM-dd') as any)
        : null,
    },
  });

  const handleReset = () => {
    setEditingMatchData(undefined);
    setModalStatus(DEFAULT_MODAL);
  };

  const isDoubles = !!DOUBLES_TOURNAMENT_TYPES_NUMBER.includes(
    initialTournamentValues.tournament_type as number
  );

  const registeredPlayersIds: number[] = tournament?.players_order
    ? getRegPlayersIds(JSON.parse(tournament?.players_order), isDoubles)
    : [];

  const newSelectedPlayersIds = multiSelectToIds(newSelectedPlayers);
  const brackets =
    tournament?.draw &&
    (JSON.parse(tournament.draw)?.brackets as IBracketsUnit[][]);
  const unregPlayers: {
    first_name: string;
    last_name: string;
    phone?: string;
  }[] = tournament?.unregistered_players
    ? JSON.parse(tournament.unregistered_players)
    : [];

  // submit tournament changes
  const submitTournaments = async (tournamentFields: any) => {
    setIsLoading(true);
    const newSelectedPlayersIds = newSelectedPlayers.reduce(
      (acc, v) => [...acc, v.value],
      [] as number[]
    );

    const res = await updateTournament({
      id: tournament?.id as number,
      ...tournamentFields,
      players_order: JSON.stringify({
        players: registeredPlayersIds.concat(newSelectedPlayersIds),
      }),
      draw: !tournamentFields.draw ? JSON.stringify({
        brackets: brackets,
      }) : tournamentFields.draw,
    });

    if (res.isOk) {
      mutate();

      setNewSelectedPlayers([]);
    }
    setIsLoading(false);
  };

  // submit match changes
  const submitMatch = async (match: MatchT) => {
    setIsLoading(true);
    // if there is no si and mi indexes then we should create a new match
    // otherwise we should update existing match
    if (
      editingMatchData?.si !== undefined &&
      editingMatchData?.mi !== undefined
    ) {
      const {
        player1_id,
        player2_id,
        player3_id,
        player4_id,
        winner_id,
        score,
        time,
      } = match;

      const matchRes = await createMatch({
        tournament_id: tournament?.id,
        player1_id,
        player2_id,
        player3_id,
        player4_id,
        winner_id,
        is_completed: false,
        time,
        score,
      } as MatchT);

      if (matchRes.isOk) {
        const { data } = matchRes;

        const newBrackets = (brackets as IBracketsUnit[][]).map((s, si) =>
          s.map((m, mi) => {
            const isTargetMatch =
              si === editingMatchData.si && mi === editingMatchData.mi;
            // to handle brackets with groups
            if (editingMatchData.isGroupMatch && isTargetMatch) {
              return [...(m as any), { matchId: data?.id }];
            }

            if (isTargetMatch) {
              return { matchId: data?.id };
            }

            return m;
          })
        );

        const res = await updateTournament({
          id: tournament?.id,
          draw: JSON.stringify({
            brackets: newBrackets,
          }),
        } as TournamentT);

        if (res.isOk) {
          mutate();

          setModalStatus(DEFAULT_MODAL);
        }
      }
    } else {
      // logic to change elo ranking is inside this function
      const matchRes = await updateMatch(match);

      if (matchRes.isOk) {
        mutate();

        setModalStatus(DEFAULT_MODAL);
      }
    }
    setIsLoading(false);
  };

  // delete tournament and related matches
  const handleDeleteClick = async () => {
    const res = await deleteSelectedTournament(tournament?.id as number);

    if (res.isOk) {
      mutateTournaments();

      router.push('/admin/tournaments');
    }
  };

  const handleResetClick = () => {
    reset();
    setNewSelectedPlayers([]);
  };

  const openModalForNewMatch = useCallback(
    (si: number, mi: number, isGroupMatch?: boolean) => {
      setModalStatus({ isOpen: true, type: 'create' });
      setEditingMatchData({
        si,
        mi,
        isGroupMatch,
      });
    },
    []
  );

  const openModalForExistingMatch = useCallback((match: MatchT) => {
    setModalStatus({ isOpen: true, type: 'update' });
    setEditingMatchData({ newMatch: match });
  }, []);

  const isDisabled =
    // OLD db records has is_finished prop...so we check it
    // (editingTournament.is_finished !== null && editingTournament.is_finished) ||
    // NEW db records has status prop...one of statuses is finished (equal to 3)....so we check it
    // (editingTournament.status === 3);
    false || isLoading;

  // this regestered players array we use to get options for "edit match" players select inputs
  // also we use same data to get options for "draw unit" players select inputs (TournamentT)
  const registeredPlayers = players.filter(
    ({ id }) => registeredPlayersIds.indexOf(id) !== -1
  );

  return (
    <div className={styles.container}>
      {isLoading && <LoadingShadow />}
      <PageTitle>Управление турниром</PageTitle>
      <div className={styles.buttons}>
        <button
          className={styles.save}
          disabled={!isDirty && newSelectedPlayers.length === 0}
          onClick={handleSubmit(submitTournaments)}
        >
          Сохранить
        </button>
        <button
          className={styles.reset}
          onClick={handleResetClick}
          disabled={!isDirty && newSelectedPlayers.length === 0}
        >
          Отменить
        </button>
        <button className={styles.delete} onClick={handleDeleteClick}>
          Удалить
        </button>
      </div>
      <div className={styles.twoSides}>
        <div className={styles.side}>
          <p className={styles.sideTitle}>Поля турнира</p>
          <TournamentForm register={register} setValue={setValue} />
        </div>
        <div className={cl(styles.side, styles.addPlayersContainer)}>
          <p className={styles.sideTitle}>Игроки</p>
          <p className={styles.playersListTitle}>Через форму в прилке</p>
          <div className={styles.playersList}>
            {unregPlayers.length > 0
              ? unregPlayers.map(({ first_name, last_name, phone }) => (
                  <div key={last_name + first_name} className={styles.player}>
                    <span>
                      {`${first_name} ${last_name}`}
                      {phone && `, тел: ${phone}`}
                    </span>
                  </div>
                ))
              : 'нет регистраций через форму'}
          </div>
          <p className={styles.playersListTitle}>Новые игроки</p>
          <MultiSelect
            className={styles.tournamentPlayersMultiselect}
            disabled={isDisabled}
            options={playersToMultiSelect(players)}
            value={newSelectedPlayers}
            onChange={setNewSelectedPlayers}
            labelledBy="Выбирите игроков из списка"
          />
          {newSelectedPlayersIds.length > 0 ? (
            <div className={styles.playersList}>
              {players.map((v) =>
                newSelectedPlayersIds.indexOf(v.id) !== -1 ? (
                  <div key={v.id} className={styles.player}>
                    <span>{`${v.first_name} ${v.last_name}`}</span>
                  </div>
                ) : null
              )}
            </div>
          ) : (
            'нет несохраненных игроков'
          )}
          <p className={styles.playersListTitle}>Уже зарегестрировавшиеся</p>
          <div className={styles.playersList}>
            {registeredPlayersIds &&
              players.map((v) =>
                registeredPlayersIds.indexOf(v.id) !== -1 ? (
                  <div key={v.id} className={styles.player}>
                    <span>{`${v.first_name} ${v.last_name}`}</span>
                  </div>
                ) : null
              )}
          </div>
        </div>
      </div>
      {tournament?.draw_type ? (
        <TournamentDraw
          isDoubles={isDoubles}
          isDisabled={isDisabled}
          matches={tournament?.match || []}
          brackets={brackets || [[]]}
          registeredPlayers={registeredPlayers}
          openModalForNewMatch={openModalForNewMatch}
          openModalForExistingMatch={openModalForExistingMatch}
        />
      ) : (
        'Выбирите тип сетки турнира чтобы создать турнир'
      )}
      {modalStatus.isOpen && (
        <Modal title="Редактировать матч" handleClose={handleReset}>
          <MatchForm
            isDoubles={isDoubles}
            match={editingMatchData?.newMatch as MatchT}
            onSubmit={submitMatch}
            registeredPlayers={registeredPlayers}
          />
          <span style={{ color: 'grey', fontSize: 14 }}>
            Рейтинг ЭЛО будет изменен, если указать победителя и результат матча
            {'\n'}в уже СОЗДАННОМ матче {'('} если создавать матч сразу с
            победителем и счетом, то ЭЛО не изменится{')'}
          </span>
        </Modal>
      )}
    </div>
  );
};

export default AdminSingleTournamentPape;

export const getServerSideProps = async (ctx: NextPageContext) => {
  const initialTournamentValues = await prisma.tournament.findUnique({
    where: {
      id: parseInt(ctx.query.pid as string),
    },
    include: {
      match: true,
    },
  });

  return {
    props: {
      initialTournamentValues,
    },
  };
};
