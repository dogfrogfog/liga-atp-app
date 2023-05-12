import { useState, memo, Dispatch, SetStateAction, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';

import PageTitle from 'ui-kit/PageTitle';
import DigestListEl from 'components/DigestListEl';
import useDigests from 'hooks/useDigests';

import { DIGEST_PAGE_SIZE } from 'constants/values';
import styles from 'styles/Digests.module.scss';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import { useRouter } from "next/router";

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
    const [scrollDigest, setScrollDigest] = useState<number>(0);
    const router = useRouter();
    useEffect(() => {
      const savedScrollPosition = sessionStorage.getItem('scrollDigest');
      if (savedScrollPosition) {
        setScrollDigest(parseInt(savedScrollPosition, 10));
      }
      window.scrollTo(0, scrollDigest);
    }, [scrollDigest]);
    const handleScroll = useCallback((id: number) => {
      sessionStorage.setItem('scrollDigest', window.pageYOffset.toString());
      router.push(`/digests/${id}`);
    }, [router])

    if (isLastPage && isLoading) {
      return <LoadingSpinner />;
    }

    return (
      <>
        {digests.map((d) => (
          <div key={d.id} className={styles.listEl} onClick={() => handleScroll(d.id)}>
              <DigestListEl
                key={d.id}
                title={d.title || ''}
                date={d.date || undefined}
              />
          </div>
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
      </>
    );
  }
);

export default DigestsPage;
