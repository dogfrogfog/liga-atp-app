import type { digest as DigestT } from '@prisma/client';
import { format } from 'date-fns';

import styles from './DigestListEl.module.scss';

const DigestListEl = ({
  id,
  title,
  date,
  onClick,
}: DigestT & { onClick: (id: number) => void }) => (
  <div onClick={() => onClick(id)} className={styles.digestListEl}>
    <span className={styles.title}>{title}</span>
    <span className={styles.date}>
      {format(new Date(date as Date), 'dd.MM.yyyy')}
    </span>
  </div>
);

export default DigestListEl;
