import { format } from 'date-fns';

import styles from './DigestListEl.module.scss';

const DigestListEl = ({ title, date }: { title: string; date?: Date }) => (
  <div className={styles.digestListEl}>
    <span className={styles.title}>{title}</span>
    <span className={styles.date}>
      {date && format(new Date(date), 'dd.MM.yyyy')}
    </span>
  </div>
);

export default DigestListEl;
