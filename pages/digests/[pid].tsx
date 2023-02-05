import type { NextPage, NextPageContext } from 'next';
import type { digest as DigestT } from '@prisma/client';
import dynamic from 'next/dynamic';
import { format } from 'date-fns';

import PageTitle from 'ui-kit/PageTitle';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import { prisma } from 'services/db';
import styles from 'styles/Digests.module.scss';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const DigestPage: NextPage<{ digest: DigestT }> = ({ digest }) => {
  return (
    <div className={styles.pageContainer}>
      <span className={styles.singleDigestDate}>
        {format(new Date(digest.date as Date), 'dd.MM.yyyy')}
      </span>
      <PageTitle>{digest.title}</PageTitle>
      <br />
      <div className={styles.markdownContainer}>
        <MarkdownPreview source={digest.markdown || ''} />
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const digest = await prisma.digest.findUnique({
    where: {
      id: parseInt(ctx.query.pid as string, 10),
    },
  });

  return {
    props: {
      digest,
    },
  };
};

export default DigestPage;
