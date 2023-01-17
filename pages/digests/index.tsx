import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import PageTitle from 'ui-kit/PageTitle';
import DigestListEl from 'components/DigestListEl';
import useDigests from 'hooks/useDigests';
import styles from 'styles/Digests.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

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
