import Link from 'next/link';
import type { player as PlayerT } from '@prisma/client';
import { BsFillPersonFill } from 'react-icons/bs';
import { LEVEL_NUMBER_VALUES } from 'constants/values';

import styles from './PlayersList.module.scss';

type PlayersListProps = {
  players: PlayerT[];
};

const PlayersList = ({ players }: PlayersListProps) => (
  <div className={styles.playersTable}>
    <div className={styles.titles}>
      <span className={styles.nameColumn}>Имя</span>
      <span className={styles.levelColumn}>Уровень</span>
      <span className={styles.rankColumn}>Рейтинг</span>
    </div>
    <div className={styles.list}>
      {players.map(({ id, first_name, last_name, level, avatar }) => (
        <Link key={id} href={'/players/' + id}>
          <div className={styles.listItem}>
            <div className={styles.nameColumn}>
              <div className={styles.playerName}>
                <div className={styles.image}>
                  {avatar ? null : <BsFillPersonFill />}
                </div>
                <span>{`${(
                  first_name as string
                )[0].toUpperCase()}. ${last_name}`}</span>
              </div>
            </div>
            <div className={styles.levelColumn}>
              {level ? LEVEL_NUMBER_VALUES[level] : ''}
            </div>
            <div className={styles.rankColumn}>
              <span className={styles.rankValue}>1489</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default PlayersList;
