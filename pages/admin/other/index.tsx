import type { NextPage } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';

import PageTitle from 'ui-kit/PageTitle';
import useOtherPages from 'hooks/useOtherPages';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import styles from 'styles/AdminOther.module.scss';

const AdminOtherPage: NextPage = () => {
  const { otherPages, isLoading } = useOtherPages();

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Страницы раздела прочее</PageTitle>
      <Link href="/admin/other/new">
        <a className={styles.createPageButton}>создать страницу</a>
      </Link>
      <br />
      <br />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        otherPages.map((v) => (
          <Fragment key={v.slug}>
            <Link href={`/admin/other/${v.slug}`}>{v.title}</Link>
            <br />
            <br />
          </Fragment>
        ))
      )}
    </div>
  );
};

export default AdminOtherPage;
