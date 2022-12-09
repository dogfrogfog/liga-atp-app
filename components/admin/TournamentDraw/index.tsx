import { useMemo } from 'react';
import type { player as PlayerT, match as MatchT } from '@prisma/client';
import { AiOutlineEye, AiOutlinePlus } from 'react-icons/ai';
import { AiFillEdit } from 'react-icons/ai';
import cl from 'classnames';

import styles from './TournamentDraw.module.scss';

interface ITournamentDrawProps {
  isDoubles: boolean;
  isDisabled: boolean;
  matches: MatchT[];
  brackets: IBracketsUnit[][];
  registeredPlayers: PlayerT[];
  openModalForNewMatch: (si: number, mi: number) => void;
  openModalForExistingMatch: (m: MatchT) => void;
}

export interface IBracketsUnit {
  stageIndex?: number;
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
              stage?.map((bracketUnit, mi) => {
                // ----------------
                // START old format !! todo: implement
                // ----------------

                console.log(bracketUnit);

                // render something for legacy draws (ideally remove this code)
                // if (bracketUnit.team1Id) {
                //   console.log(bracketUnit);
                //   return (
                //     <div>
                //       <div>
                //         hi
                //       </div>
                //     </div>
                //   );
                // }

                // --------------
                // END old format
                // --------------

                // ------------------------------------------------------------------------------
                // START new format single/doubles tournament with/without quali (no group stage)
                // ------------------------------------------------------------------------------
                const matchRecord = bracketUnit.matchId
                  ? (findMatchRecordById(
                      matches,
                      bracketUnit.matchId
                    ) as MatchT)
                  : null;

                return (
                  <div key={si + mi} className={styles.matchContainer}>
                    {matchRecord && (
                      <>
                        <span className={styles.matchId}>
                          MatchID: {matchRecord?.id}
                        </span>
                        <div>
                          <div
                            className={cl(
                              styles.playersPair,
                              matchRecord.score &&
                                matchRecord.player1_id ===
                                  parseInt(matchRecord?.winner_id as any, 10)
                                ? styles.winner
                                : styles.loser
                            )}
                          >
                            <span className={styles.player}>
                              {playersNames.get(
                                matchRecord.player1_id as number
                              )}
                            </span>
                            <span className={styles.player}>
                              {isDoubles &&
                                playersNames.get(
                                  matchRecord.player3_id as number
                                )}
                            </span>
                          </div>
                          <p className={styles.vs}>VS</p>
                          <div
                            className={cl(
                              styles.playersPair,
                              matchRecord.score &&
                                matchRecord.player2_id ===
                                  parseInt(matchRecord?.winner_id as any, 10)
                                ? styles.winner
                                : styles.loser
                            )}
                          >
                            <span className={styles.player}>
                              {playersNames.get(
                                matchRecord.player2_id as number
                              )}
                            </span>
                            <span className={styles.player}>
                              {isDoubles &&
                                playersNames.get(
                                  matchRecord.player4_id as number
                                )}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                    {matchRecord?.score && (
                      <div className={styles.score}>{matchRecord.score}</div>
                    )}
                    {matchRecord ? (
                      <button
                        className={cl(styles.drawUnitAction, styles.editMatch)}
                        disabled={isDisabled}
                        onClick={() => openModalForExistingMatch(matchRecord)}
                      >
                        <AiFillEdit /> Обновить матч
                      </button>
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

                // ----------------------------------------------------------------------------
                // END new format single/doubles tournament with/without quali (no group stage)
                // ----------------------------------------------------------------------------

                // ----------------------------------------------------------
                // START new format single/doubles tournament WITH groupstage
                // ----------------------------------------------------------

                if (Array.isArray(bracketUnit)) {
                  // each element of bracketUnit array should be a match
                  // the idea is to loop over bracketUnitArray and show every match played
                  // with ability to watch and edit match so as it was regular match

                  const matches = [];

                  return (
                    <div className={styles.singleGroup} key={si + mi}>
                      <p className={styles.groupTitle}>Группа {mi + 1}</p>
                      <div className={styles.matchesList}>
                        {matches.map((v) => 'wefwefewf')}
                      </div>
                      <div className={styles.groupControlButtons}>
                        <button>
                          <AiOutlinePlus />
                        </button>
                        <button>
                          <AiOutlineEye />
                        </button>
                      </div>
                    </div>
                  );
                }

                // --------------------------------------------------------
                // END new format single/doubles tournament WITH groupstage
                // --------------------------------------------------------
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TournamentDraw;
