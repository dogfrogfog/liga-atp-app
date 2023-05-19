import { FC } from 'react';
import Link from 'next/link';
import { PlayerInfo } from 'Interfaces/IMatchesToday';
import styles from './TournamentMatchLive.module.scss';


const PlayerInfoMatchLive: FC<PlayerInfo> = ({player, isDoubles, winner}) => {
    return (
        <Link href={`/players/${player?.id}`}>
            <a className={player?.id === Number(winner) && !isDoubles ? styles.winner : ''}>
            {player?.first_name[0]}. {player?.last_name}
            </a>
        </Link>
    )
}

export default PlayerInfoMatchLive;