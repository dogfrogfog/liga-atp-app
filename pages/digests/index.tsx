import type { NextPage } from 'next';
import type { digest as DigestT } from '@prisma/client';
import { format } from 'date-fns';

import PageTitle from 'ui-kit/PageTitle';
import useDigests from 'hooks/useDigests';
import styles from 'styles/Digests.module.scss';

const DigestListEl = ({ title, date }: DigestT) => (
  <div className={styles.digestListEl}>
    <span className={styles.title}>{title}</span>
    <span className={styles.date}>
      {format(new Date(date as Date), 'dd.MM.yyyy')}
    </span>
  </div>
);

const DigestsPage: NextPage = () => {
  const { digests } = useDigests();

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Дайджесты</PageTitle>
      {digests.map((d) => (
        <DigestListEl key={d.id} {...d} />
      ))}
    </div>
  );
};

export default DigestsPage;
