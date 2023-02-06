import type { NextPage } from 'next';

import { prisma } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import { OTHER_PAGES_KEYS } from 'constants/values';
import styles from 'styles/Other.module.scss';

type SchedulePageProps = {
  content: string;
};

const SchedulePage: NextPage<SchedulePageProps> = ({ content }) => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Расписание</PageTitle>
      <div className={styles.markdownContainer}>{content}</div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const scheduleRecord = await prisma.other_pages.findUnique({
    where: {
      page_name: OTHER_PAGES_KEYS.schedule,
    },
  });

  return {
    props: {
      content: scheduleRecord?.content,
    },
  };
};

export default SchedulePage;
