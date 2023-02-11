import { useMemo } from 'react';
import type { player as PlayerT, match as MatchT } from '@prisma/client';
import { AiOutlinePlus } from 'react-icons/ai';
import { AiFillEdit } from 'react-icons/ai';
import cl from 'classnames';

import styles from './TournamentDraw.module.scss';

interface ITournamentDrawProps {
  isDoubles: boolean;
  isDisabled: boolean;
  matches: MatchT[];
  brackets: IBracketsUnit[][];
  registeredPlayers: PlayerT[];
  openModalForNewMatch: (
    si: number,
    mi: number,
    isGroupMatch?: boolean
  ) => void;
  openModalForExistingMatch: (m: MatchT) => void;
}

export interface IBracketsUnit {
  stageIndex: number;
  matchIndex?: number;
  // todo: should be implemented for groups draw_type (after refactoring)
  groupIndex?: number; // only for draw type starting with G (G6 - G16)
  matchId?: number;
  team1Id?: number;
}

const findMatchRecordById = (matches: MatchT[], targetMatchId: number) =>
  matches.find(({ id }) => id === targetMatchId);

const TournamentDraw = ({
  isDoubles,
  isDisabled,
  matches,
  brackets,
  registeredPlayers,
  openModalForNewMatch,
  openModalForExistingMatch,
}: ITournamentDrawProps) => {
  const playersNames = useMemo(
    () =>
      registeredPlayers.reduce((acc, p) => {
        acc.set(p.id, `${p.last_name} ${(p.first_name as string)[0]}.`);

        return acc;
      }, new Map<number, string>()),
    [registeredPlayers]
  );

  return (
    <div className={styles.drawContainer}>
      {brackets?.map((stage, si) => (
        <div key={si} className={styles.stage}>
          <p className={styles.stageTitle}>Стадия {si + 1}</p>
          <div>
            {Array.isArray(stage) &&
              stage.map((bracketUnit, mi) => {
                // todo: implement
                // old format
                if (bracketUnit?.team1Id) {
                  return (
                    <div key={si + mi} className={styles.matchContainer}>
                      Deprecated team1: {bracketUnit?.team1Id}
                    </div>
                  );
                }

                // for groups format (bracketUnit is array)
                if (Array.isArray(bracketUnit)) {
                  // each element of bracketUnit array should be a match
                  // the idea is to loop over bracketUnit, which is array and show every match played
                  // with ability to watch and edit match so as it was regular match
                  return (
                    <div
                      className={cl(styles.matchContainer, styles.singleGroup)}
                      key={si + mi}
                    >
                      <p className={styles.groupTitle}>Группа {mi + 1}</p>
                      <div className={styles.groupMatches}>
                        {/* @ts-ignore */}
                        {bracketUnit.map((v) => {
                          const matchRecord = findMatchRecordById(
                            matches,
                            v.matchId
                          );
                          return (
                            matchRecord && (
                              <Match
                                isDoubles={isDoubles}
                                isDisabled={isDisabled}
                                matchRecord={matchRecord}
                                playersNames={playersNames}
                                handleUpdateClick={() =>
                                  openModalForExistingMatch(matchRecord)
                                }
                              />
                            )
                          );
                        })}
                        <button
                          className={cl(
                            styles.drawUnitAction,
                            styles.createMatch
                          )}
                          disabled={isDisabled}
                          onClick={() => openModalForNewMatch(si, mi, true)}
                        >
                          <AiOutlinePlus /> Создать матч
                        </button>
                      </div>
                    </div>
                  );
                }

                // for common format (bracketUnit is a match)
                const matchRecord = bracketUnit?.matchId
                  ? (findMatchRecordById(
                      matches,
                      bracketUnit.matchId
                    ) as MatchT)
                  : null;

                return (
                  <div key={si + mi} className={styles.matchContainer}>
                    {matchRecord ? (
                      <Match
                        isDoubles={isDoubles}
                        isDisabled={isDisabled}
                        matchRecord={matchRecord}
                        playersNames={playersNames}
                        handleUpdateClick={() =>
                          openModalForExistingMatch(matchRecord)
                        }
                      />
                    ) : (
                      <button
                        className={cl(
                          styles.drawUnitAction,
                          styles.createMatch
                        )}
                        disabled={isDisabled}
                        onClick={() => openModalForNewMatch(si, mi)}
                      >
                        <AiOutlinePlus /> Создать матч
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

type MatchProps = {
  isDisabled: boolean;
  handleUpdateClick: () => void;
  isDoubles: boolean;
  matchRecord: MatchT;
  playersNames: Map<number, string>;
};

const Match = ({
  isDisabled,
  isDoubles,
  matchRecord,
  playersNames,
  handleUpdateClick,
}: MatchProps) => {
  if (!matchRecord) {
    return null;
  }

  const isPlayed = !!(matchRecord.score && matchRecord.winner_id);

  return (
    <div className={styles.match}>
      <p
        className={cl(
          styles.players,
          isPlayed &&
            matchRecord.player1_id ===
              parseInt(matchRecord.winner_id as string, 10)
            ? styles.winner
            : ''
        )}
      >
        {playersNames.get(matchRecord.player1_id as number)}
        {isDoubles &&
          ` / ${playersNames.get(matchRecord.player3_id as number) || ''}`}
      </p>
      <p className={styles.vs}>VS</p>
      <p
        className={cl(
          styles.players,
          isPlayed &&
            matchRecord.player2_id ===
              parseInt(matchRecord.winner_id as string, 10)
            ? styles.winner
            : ''
        )}
      >
        {playersNames.get(matchRecord.player2_id as number)}
        {isDoubles &&
          ` / ${playersNames.get(matchRecord.player4_id as number) || ''}`}
      </p>
      <div className={styles.matchInfo}>
        <span>
          <b>score:</b> {matchRecord.score || 'не указан'}
        </span>
        <button
          className={styles.updateButton}
          disabled={isDisabled}
          onClick={handleUpdateClick}
        >
          <AiFillEdit /> Изменить
        </button>
      </div>
      <span className={styles.matchId}>matchId: {matchRecord.id}</span>
    </div>
  );
};

export default TournamentDraw;
