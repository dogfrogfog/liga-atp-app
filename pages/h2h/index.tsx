import { useState, Fragment } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';
import PageTitle from 'ui-kit/PageTitle';
import SuggestionsInput from 'ui-kit/SuggestionsInput';
import { prisma } from 'services/db';
import styles from 'styles/H2h.module.scss';

type H2hPageProps = {
  players: PlayerT[];
};

const H2hPage: NextPage<H2hPageProps> = ({ players }) => {
  const router = useRouter();
  const [selectedPlayers, setPlayers] = useState<PlayerT[]>([]);

  const onSuggestionClick = (p: PlayerT) => {
    setPlayers((v) => [...v, p]);
  };

  const reset = () => {
    setPlayers([]);
  };

  const filterFn = (inputValue: string) => (p: PlayerT) =>
    ((p?.first_name as string) + ' ' + p?.last_name)
      .toLowerCase()
      .includes(inputValue);

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Head To Head</PageTitle>
      <div className={styles.selection}>
        {selectedPlayers.length > 0 &&
          selectedPlayers.map((p, i) => (
            <Fragment key={p.id}>
              <div className={styles.selectedPlayer}>
                {(p.first_name as string)[0]}. {p.last_name}
              </div>
              {i === 0 && <span className={styles.vs}>vs.</span>}
            </Fragment>
          ))}
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
          <button
            onClick={() =>
              router.push(
                `/h2h/compare?p1Id=${selectedPlayers[0]?.id}&p2Id=${selectedPlayers[1]?.id}`
              )
            }
            disabled={selectedPlayers.length !== 2}
            className={styles.compare}
          >
            Сравнить
          </button>
          <button
            onClick={reset}
            className={styles.reset}
            disabled={selectedPlayers.length === 0}
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const players = await prisma.player.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
    },
  });

  return {
    props: {
      players,
    },
    revalidate: 10, // 10 min
  };
};

export default H2hPage;
