import Image from 'next/image';
import type { player as PlayerT } from '@prisma/client';
import { BsFillPersonFill } from 'react-icons/bs';
import cl from 'classnames';

import { LEVEL_NUMBER_VALUES } from 'constants/values';
import styles from './PlayersList.module.scss';

type PlayersListProps = {
    players: (PlayerT & { elo_points: any })[];
    handleScroll?: (id: number) => void;
    shouldShowPlace?: boolean;
};

export const PlayersList = ({players, handleScroll, shouldShowPlace = false}: PlayersListProps) => {
    return (
        <div className={styles.list}>
            {players.map(
                ({id, first_name, last_name, level, avatar, elo_points}, i) => (
                    <div
                        key={id}
                        className={cl(
                            styles.listItem,
                            shouldShowPlace ? styles.withPlace : ''
                        )}
                        onClick={() => handleScroll && handleScroll(id)}
                    >
                        {shouldShowPlace && (
                            <div className={styles.placeColumn}>
                                <span className={styles.place}>{i + 1}</span>
                            </div>
                        )}
                        <div className={styles.nameColumn}>
                            <div className={styles.image}>
                                {avatar?.includes('.userapi.com') ? (
                                    <Image
                                        alt="player-image"
                                        src={avatar}
                                        height={25}
                                        width={25}
                                    />
                                ) : (
                                    <BsFillPersonFill/>
                                )}
                            </div>
                            <span className={styles.name}>{`${(
                                first_name as string
                            )[0].toUpperCase()}. ${last_name}`}</span>
                        </div>
                        <div className={styles.levelColumn}>
                            {level !== null ? LEVEL_NUMBER_VALUES[level] : ''}
                        </div>
                        <div className={styles.rankColumn}>
                            <span className={styles.rankValue}>{elo_points}</span>
                        </div>
                    </div>
                )
            )}
        </div>
    )
};

export const PlayersListHeader = ({
                                      shouldShowPlace = false,
                                  }: {
    shouldShowPlace?: boolean;
}) => (
    <div className={styles.titles}>
        {shouldShowPlace && <span className={styles.placeColumn}>Топ</span>}
        <span className={styles.nameColumn}>Имя</span>
        <span className={styles.levelColumn}>Уровень</span>
        <span className={styles.rankColumn}>Эло</span>
    </div>
);
