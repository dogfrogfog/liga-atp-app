import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

import { prisma } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import { OTHER_PAGES_KEYS } from 'constants/values';
import styles from 'styles/Other.module.scss';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

type EventsSchedulePageProps = {
  content: string;
};

const EventsSchedulePage: NextPage<EventsSchedulePageProps> = ({ content }) => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Расписание мероприятий</PageTitle>
      <div className={styles.markdownContainer}>
        <MarkdownPreview source={content || ''} />
      </div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const eventsRecord = await prisma.other_pages.findUnique({
    where: {
      page_name: OTHER_PAGES_KEYS.events,
    },
  });

  return {
    props: {
      content: eventsRecord?.content,
    },
  };
};

export default EventsSchedulePage;
