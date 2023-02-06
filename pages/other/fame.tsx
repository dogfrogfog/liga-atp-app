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

type FamePageProps = {
  content: string;
};

const FamePage: NextPage<FamePageProps> = ({ content }) => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Аллея славы</PageTitle>
      <div className={styles.markdownContainer}>
        <MarkdownPreview source={content || ''} />
      </div>
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
