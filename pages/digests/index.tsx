import type { NextPage } from 'next';
import type { digest as DigestT } from '@prisma/client';
import { format } from 'date-fns';
import { useRouter } from 'next/router';

import PageTitle from 'ui-kit/PageTitle';
import useDigests from 'hooks/useDigests';
import styles from 'styles/Digests.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

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

const DigestsPage: NextPage = () => {
  const { digests, isLoading } = useDigests();
  const router = useRouter();

  const onDigestClick = (id: number) => {
    router.push(`/digests/${id}`);
  };

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Дайджесты</PageTitle>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        digests.map((d) => (
          <DigestListEl key={d.id} {...d} onClick={onDigestClick} />
        ))
      )}
    </div>
  );
};

export default DigestsPage;
