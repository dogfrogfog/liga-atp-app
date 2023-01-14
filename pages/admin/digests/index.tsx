import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { digest as DigestT } from '@prisma/client';
import { format } from 'date-fns';

import useDigests from 'hooks/useDigests';

import styles from './styles.module.scss';

const DigestCard = ({
  id,
  image_link,
  date,
  // @ts-ignore
  desc,
  title,
  onClick,
}: DigestT & { onClick: (id: number) => void }) => (
  <div className={styles.digestCard} onClick={() => onClick(id)}>
    <span className={styles.id}>id</span>
    <div className={styles.digestCardHeader}>
      {/* todo: implement image */}
      {/* {image_link} */}
    </div>
    <div className={styles.digestCardFooter}>
      <div className={styles.date}>
        {date && format(new Date(date), 'dd.MM.yyyy')}
      </div>
      <span className={styles.title}>{title}</span>
      <span className={styles.desc}>{desc}</span>
    </div>
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
      {[
        {
          id: 11,
          image_link: '',
          date: new Date(),
          desc: 'Lorem  iprum lorem  iprum dolor lorem  iprum dolor lorem  iprum dolor lorem  iprum dolor, lorem  iprum dolor, lorem  iprum dolor',
          title: 'Дайджест номер 23',
        },
      ].map((p) => (
        // @ts-ignore
        <DigestCard key={p.id} {...p} onClick={onCardClick} />
      ))}
    </div>
  );
};

export default DigestMainPage;
