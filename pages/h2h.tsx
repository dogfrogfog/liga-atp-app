import { useState } from 'react';
import type { NextPage } from 'next';
import type { player as PlayerT } from '@prisma/client';

import { prisma } from 'services/db';
// import { getH2hPlayers } from 'services/players';
// import SearchInput from 'components/SearchInput';
import styles from 'styles/H2h.module.scss';

const H2hPage: NextPage<{ allPlayers: PlayerT[] }> = ({ allPlayers }) => {
  const [selectedPlayers, setPlayers] = useState<PlayerT[]>([]);

  console.log(allPlayers);
  // const handlePlayerSelect = (p) => {
  //   setPlayers(v => v.push(p))
  // };

  return (
    <div className={styles.container}>
      <p className={styles.pageTitle}>Head To Head</p>
      <div className={styles.selection}>
        {selectedPlayers.length > 0 &&
          selectedPlayers.map((p) => (
            <div key={p.id} className={styles.selectedPlayer}>
              {(p.first_name as string)[0]}. {p.last_name}
            </div>
          ))}
        <div>
          {selectedPlayers.length !== 2 && (
            <input
              className={styles.input}
              placeholder={`Введите имя ${
                selectedPlayers.length === 1 ? 'второго' : 'первого'
              } игрока`}
            />
          )}
        </div>
        <div></div>
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
