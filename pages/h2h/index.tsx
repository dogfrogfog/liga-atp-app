import { useState, Fragment } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import type { player as PlayerT } from '@prisma/client';
import cl from 'classnames';

import usePlayers from 'hooks/usePlayers';
import PageTitle from 'ui-kit/PageTitle';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import styles from 'styles/H2h.module.scss';

const H2hPage: NextPage = () => {
  const { players } = usePlayers();
  const [selectedPlayers, setPlayers] = useState<PlayerT[]>([]);

  const onSuggestionClick = (p: PlayerT) => {
    setPlayers((v) => [...v, p]);
  };

  const reset = () => {
    setPlayers([]);
  };

  // same as /players page
  const filterFn = (inputValue: string) => (p: PlayerT) =>
    ((p?.first_name as string) + ' ' + p?.last_name)
      .toLowerCase()
      .includes(inputValue);

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Head To Head</PageTitle>
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
        <div className={cl(selectedPlayers.length === 0 ? styles.initial : '')}>
          {selectedPlayers.length !== 2 && (
            <div className={styles.searchInputContainer}>
              <SuggestionsInput
                placeholder={`Введите имя ${
                  selectedPlayers.length === 1 ? '2-го' : '1-го'
                } игрока`}
                suggestions={players}
                onSuggestionClick={onSuggestionClick}
                filterFn={filterFn}
              />
            </div>
          )}
          <div className={styles.buttons}>
            <Link
              href={`/h2h/compare?p1Id=${selectedPlayers[0]?.id}&p2Id=${selectedPlayers[1]?.id}`}
            >
              <span
                className={cl(
                  styles.compare,
                  !selectedPlayers[0]?.id || !selectedPlayers[1]?.id
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

export default H2hPage;
