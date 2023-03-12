import type { NextPage } from 'next';
import Link from 'next/link';

import PageTitle from 'ui-kit/PageTitle';
import useOtherPages from 'hooks/useOtherPages';
import styles from 'styles/AdminOther.module.scss';

const AdminOtherPage: NextPage = () => {
  const { otherPages } = useOtherPages();

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Страницы раздела прочее</PageTitle>
      <Link href="/admin/other/new">
        <a className={styles.createPageButton}>
            создать страницу
        </a>
      </Link>
      <br />
      <br />
      {otherPages.map(v => (
        <>
          <Link href={`/admin/other/${v.slug}`}>
              {v.title}
          </Link>
          <br />
          <br />
        </>
      ))}
    </div>
  );
};

export default AdminOtherPage;
