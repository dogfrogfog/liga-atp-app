import type { NextPage } from 'next';
import Link from 'next/link';

import PageTitle from 'ui-kit/PageTitle';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import useOtherPages from 'hooks/useOtherPages';
import styles from 'styles/Other.module.scss';

const Other: NextPage = () => {
  const { otherPages, isLoading } = useOtherPages();

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Прочее</PageTitle>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        otherPages.map(({ title, slug }) => (
          <Link key={slug} href={`/other/${slug}`}>
            <a className={styles.pageLink}>{title}</a>
          </Link>
        ))
      )}
    </div>
  );
};

export default Other;
