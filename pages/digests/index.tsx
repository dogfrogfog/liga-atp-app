import { useState, memo } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';

import PageTitle from 'ui-kit/PageTitle';
import DigestListEl from 'components/DigestListEl';
import useDigests from 'hooks/useDigests';
import styles from 'styles/Digests.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import NotFoundMessage from 'ui-kit/NotFoundMessage';

const DigestsPage: NextPage = () => {
  const [digestPageNumber, setGigestPageNumber] = useState(1);

  const pages = (() => {
    const result = [];
    for (let i = 0; i < digestPageNumber; i += 1) {
      result.push(
        <DigestsList
          key={i}
          pageNumber={i + 1}
          isLastPage={i + 1 === digestPageNumber}
        />
      );
    }

    return result;
  })();

  return (
    <div className={styles.pageContainer}>
      <>
        <PageTitle>Дайджесты</PageTitle>
        {pages}
        <div className={styles.loadMoreContainer}>
          <button
            onClick={() => setGigestPageNumber((v) => v + 1)}
            className={styles.loadMore}
          >
            Загрузить еще
          </button>
        </div>
      </>
    </div>
  );
};

const DigestsList = ({
  pageNumber,
  isLastPage,
}: {
  pageNumber: number;
  isLastPage: boolean;
}) => {
  const { digests, isLoading } = useDigests(pageNumber);

  if (isLastPage && isLoading) {
    return <LoadingSpinner />;
  }

  if (pageNumber === 1 && isLastPage && digests.length === 0) {
    return <NotFoundMessage message="Нет доступных турниров" />;
  }

  return (
    <>
      {digests.map((d) => (
        <Link href={`/digests/${d.id}`} key={d.id}>
          <a className={styles.listEl}>
            <DigestListEl
              key={d.id}
              title={d.title || ''}
              date={d.date || undefined}
            />
          </a>
        </Link>
      ))}
    </>
  );
};

export default DigestsPage;
