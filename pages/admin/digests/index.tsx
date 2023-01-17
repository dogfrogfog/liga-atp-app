import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { digest as DigestT } from '@prisma/client';
import { format } from 'date-fns';

import useDigests from 'hooks/useDigests';
import styles from './styles.module.scss';

const DigestCard = ({
  id,
  date,
  title,
  onClick,
}: DigestT & { onClick: (id: number) => void }) => (
  <div className={styles.digestCard} onClick={() => onClick(id)}>
    <span className={styles.title}>{title}</span>
    <span className={styles.date}>
      {date && format(new Date(date), 'dd.MM.yyyy')}
    </span>
  </div>
);

const DigestMainPage: NextPage = () => {
  const router = useRouter();
  const { digests } = useDigests();

  const onCardClick = (id: number) => {
    router.push(`/admin/digests/${id}`);
  };

  return (
    <div className={styles.mainPageContainer}>
      <div className={styles.createNewDigest}>
        <Link href="/admin/digests/new">
          <span className={styles.createLink}>Создать дайджест</span>
        </Link>
      </div>
      <div className={styles.digestCardsContainer}>
        {digests.map((p) => (
          <DigestCard key={p.id} {...p} onClick={onCardClick} />
        ))}
      </div>
    </div>
  );
};

export default DigestMainPage;
