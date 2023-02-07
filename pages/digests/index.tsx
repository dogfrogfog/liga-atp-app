import { useState, memo, Dispatch, SetStateAction } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';

import PageTitle from 'ui-kit/PageTitle';
import DigestListEl from 'components/DigestListEl';
import useDigests from 'hooks/useDigests';

import { DIGEST_PAGE_SIZE } from 'constants/values';
import styles from 'styles/Digests.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

const DigestsPage: NextPage = () => {
  const [digestPageNumber, setDigestPageNumber] = useState(1);

  const pages = (() => {
    const result = [];
    for (let i = 0; i < digestPageNumber; i += 1) {
      result.push(
        <DigestsList
          key={i}
          pageNumber={i + 1}
          isLastPage={i + 1 === digestPageNumber}
          setDigestPageNumber={setDigestPageNumber}
        />
      );
    }

    return result;
  })();

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Дайджесты</PageTitle>
      {pages}
    </div>
  );
};

const DigestsList = memo(
  ({
    pageNumber,
    isLastPage,
    setDigestPageNumber,
  }: {
    pageNumber: number;
    isLastPage: boolean;
    setDigestPageNumber: Dispatch<SetStateAction<number>>;
  }) => {
    const { digests, isLoading } = useDigests(pageNumber);

    if (isLastPage && isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <div>
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
        {isLastPage && digests.length === DIGEST_PAGE_SIZE && (
          <div className={styles.loadMoreContainer}>
            <button
              onClick={() => setDigestPageNumber((v) => v + 1)}
              className={styles.loadMore}
            >
              Загрузить еще
            </button>
          </div>
        )}
      </div>
    );
  }
);

export default DigestsPage;
