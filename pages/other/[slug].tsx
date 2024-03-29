import type { NextPage, NextPageContext } from 'next';
import dynamic from 'next/dynamic';

import { prisma, other_page as OtherPageT } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import styles from 'styles/Other.module.scss';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

type OtherPageProps = {
  pageData: OtherPageT;
};

const OtherSinglePage: NextPage<OtherPageProps> = ({ pageData }) => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>{pageData.title}</PageTitle>
      <div className={styles.markdownContainer}>
        <MarkdownPreview source={pageData.markdown || ''} />
      </div>
    </div>
  );
};

export const getStaticPaths = async () => {
  const pages = await prisma.other_page.findMany();

  if (!pages) {
    return null;
  }

  return {
    paths: [],

    // paths: pages.map(({ slug }) => ({ params: { slug } })),
    fallback: 'blocking',
  };
};

export const getStaticProps = async (ctx: NextPageContext) => {
  let page;
  // @ts-ignore
  if (ctx.params?.slug) {
    page = await prisma.other_page.findUnique({
      where: {
        // @ts-ignore
        slug: ctx.params.slug,
      },
    });
  }

  if (!page) {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
    };
  }

  return {
    props: {
      pageData: page,
    },
    revalidate: 600, // sec
  };
};

export default OtherSinglePage;
