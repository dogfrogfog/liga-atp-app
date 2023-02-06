import type { NextPage } from 'next';
import Link from 'next/link';

import PageTitle from 'ui-kit/PageTitle';
import { OTHER_PAGES_KEYS } from 'constants/values';
import styles from 'styles/Other.module.scss';

const Other: NextPage = () => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Прочее</PageTitle>
      <Link href={`/other/${OTHER_PAGES_KEYS.fame}`}>
        <a className={styles.pageLink}>Аллея славы</a>
      </Link>
      <Link href={`/other/${OTHER_PAGES_KEYS.schedule}`}>
        <a className={styles.pageLink}>Расписание матчей / турниров</a>
      </Link>
      <Link href={`/other/${OTHER_PAGES_KEYS.events}`}>
        <a className={styles.pageLink}>Расписание мероприятий</a>
      </Link>
    </div>
  );
};

export default Other;
