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

export const getStaticPaths = async () => {
  const digests = await prisma.digest.findMany();

  if (!digests) {
    return null;
  }

  return {
    paths: [], 
    // paths: digests.map(({ id }) => ({ params: { pid: `${id}` } })),
    fallback: 'blocking',
  };
};

export const getStaticProps = async (ctx: NextPageContext) => {
  // @ts-ignore
  const id = ctx.params?.pid ? parseInt(ctx.params.pid as string, 10) : null;

  let digest;
  if (id) {
    digest = await prisma.digest.findUnique({
      where: {
        id,
      },
    });
  }

  if (!digest) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }

  return {
    props: {
      digest,
    },
    revalidate: 600, // 10 min
  };
};

export default DigestPage;
