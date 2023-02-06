import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import LoadingSpinner from 'ui-kit/LoadingSpinner';
import { prisma } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import { OTHER_PAGES_KEYS } from 'constants/values';
import styles from 'styles/Other.module.scss';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

type SchedulePageProps = {
  content: string;
};

const SchedulePage: NextPage<SchedulePageProps> = ({ content }) => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Расписание</PageTitle>
      <div className={styles.markdownContainer}>
        <MarkdownPreview source={content || ''} />
      </div>
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
