import cl from 'classnames';

import styles from './TournamentListItem.module.scss';

type TournamentListItemsProps = {
  name: string;
  status: string;
  startDate: string;
  winnerName?: string;
  className?: string;
};

const TournamentListItems = ({
  name,
  status,
  startDate,
  winnerName,
  className,
}: TournamentListItemsProps) => (
  <div className={cl(styles.container, className)}>
    <div className={styles.row}>
      <span className={styles.name}>{name}</span>
      <span className={styles.status}>{status}</span>
    </div>
    <div className={styles.row}>
      <span className={styles.startDate}>{startDate}</span>
      <span className={styles.winnerName}>{winnerName}</span>
    </div>
  </div>
);

export default TournamentListItems;
