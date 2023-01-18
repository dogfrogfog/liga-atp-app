import Link from 'next/link';
import type { player as PlayerT } from '@prisma/client';
import { BsFillPersonFill } from 'react-icons/bs';
import cl from 'classnames';

import { LEVEL_NUMBER_VALUES } from 'constants/values';
import styles from './PlayersList.module.scss';

type PlayersListProps = {
  players: PlayerT[];
  shouldShowPlace?: boolean;
};

const PlayersList = ({
  players,
  shouldShowPlace = false,
}: PlayersListProps) => (
  <div className={styles.playersTable}>
    <div className={styles.titles}>
      {shouldShowPlace && <span className={styles.placeColumn}>Топ</span>}
      <span className={styles.nameColumn}>Имя</span>
      <span className={styles.levelColumn}>Уровень</span>
      <span className={styles.rankColumn}>Рейт</span>
    </div>
    <div className={styles.list}>
      {players.map(({ id, first_name, last_name, level, avatar }, i) => (
        <Link key={id} href={'/players/' + id}>
          <div
            className={cl(
              styles.listItem,
              shouldShowPlace ? styles.withPlace : ''
            )}
          >
            {shouldShowPlace && (
              <div className={styles.placeColumn}>
                <span className={styles.place}>{i + 1}</span>
              </div>
            )}
            <div className={styles.nameColumn}>
              <div className={styles.image}>
                {avatar ? null : <BsFillPersonFill />}
              </div>
              <span className={styles.name}>{`${(
                first_name as string
              )[0].toUpperCase()}. ${last_name}`}</span>
            </div>
            <div className={styles.levelColumn}>
              {level !== null ? LEVEL_NUMBER_VALUES[level] : ''}
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
