import type { NextPage } from 'next';
import Link from 'next/link';

import PageTitle from 'ui-kit/PageTitle';
import styles from 'styles/Other.module.scss';

const Other: NextPage = () => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Прочее</PageTitle>
      <Link href="/other/fame">
        <a className={styles.pageLink}>Аллея славы</a>
      </Link>
      <Link href="/other/schedule">
        <a className={styles.pageLink}>Расписание матчей / турниров</a>
      </Link>
      <Link href="/other/events">
        <a className={styles.pageLink}>Расписание мероприятий</a>
      </Link>
    </div>
  );
};

export default Other;
