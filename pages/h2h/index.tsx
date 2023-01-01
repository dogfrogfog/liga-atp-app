import { useState, Fragment } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import type { player as PlayerT } from '@prisma/client';
import cl from 'classnames';

import { prisma } from 'services/db';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import styles from 'styles/H2h.module.scss';

const H2hPage: NextPage<{ allPlayers: PlayerT[] }> = ({ allPlayers }) => {
  const [selectedPlayers, setPlayers] = useState<PlayerT[]>([]);

  const onSuggestionClick = (p: PlayerT) => {
    setPlayers((v) => [...v, p]);
  };

  const reset = () => {
    setPlayers([]);
  };

  return (
    <div className={styles.container}>
      <p className={styles.pageTitle}>Head To Head</p>
      <div
        className={cl(
          styles.selection,
          selectedPlayers.length === 0 ? styles.initialSelection : ''
        )}
      >
        {selectedPlayers.length > 0 && (
          <div>
            {selectedPlayers.map((p, i) => (
              <Fragment key={p.id}>
                <div className={styles.selectedPlayer}>
                  {(p.first_name as string)[0]}. {p.last_name}
                </div>
                {i === 0 && <span className={styles.vs}>vs.</span>}
              </Fragment>
            ))}
          </div>
        )}
        <div>
          {selectedPlayers.length !== 2 && (
            <SuggestionsInput
              placeholder={`Введите имя ${
                selectedPlayers.length === 1 ? '2-го' : '1-го'
              } игрока`}
              players={allPlayers}
              onSuggestionClick={onSuggestionClick}
            />
          )}
          <div className={styles.buttons}>
            <Link
              href={`/h2h/compare?p1Id=${selectedPlayers[0]?.id}&p2Id=${selectedPlayers[1]?.id}`}
            >
              <span
                className={cl(
                  styles.compare,
                  !selectedPlayers[0]?.id && !selectedPlayers[1]?.id
                    ? styles.disabled
                    : ''
                )}
              >
                Сравнить
              </span>
            </Link>
            <button onClick={reset} className={styles.reset}>
              Сбросить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const players = await prisma.player.findMany();

  return {
    props: {
      allPlayers: players,
    },
  };
};

export default H2hPage;
