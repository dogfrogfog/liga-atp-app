import type { NextPage } from 'next';

import { prisma } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import { OTHER_PAGES_KEYS } from 'constants/values';
import styles from 'styles/Other.module.scss';

type EventsSchedulePageProps = {
  content: string;
};

const EventsSchedulePage: NextPage<EventsSchedulePageProps> = ({ content }) => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Расписание мероприятий</PageTitle>
      <div className={styles.markdownContainer}>{content}</div>
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
