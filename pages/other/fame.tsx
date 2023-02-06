import type { NextPage } from 'next';

import { prisma } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import { OTHER_PAGES_KEYS } from 'constants/values';
import styles from 'styles/Other.module.scss';

type FamePageProps = {
  content: string;
};

const FamePage: NextPage<FamePageProps> = ({ content }) => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Аллея славы</PageTitle>
      {content}
    </div>
  );
};

export const getServerSideProps = async () => {
  const fameRecord = await prisma.other_pages.findUnique({
    where: {
      page_name: OTHER_PAGES_KEYS.fame,
    },
  });

  return {
    props: {
      content: fameRecord?.content,
    },
  };
};

export default FamePage;
