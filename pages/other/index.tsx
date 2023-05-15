import type { NextPage } from 'next';
import Link from 'next/link';
import { other_page } from '@prisma/client';

import PageTitle from 'ui-kit/PageTitle';
import { prisma } from 'services/db';
import styles from 'styles/Other.module.scss';

type OtherPageProps = {
  pages: Pick<other_page, 'title' | 'slug' | 'order'>[];
};

const OtherPage: NextPage<OtherPageProps> = ({ pages }) => {
  console.log(pages);
  
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Прочее</PageTitle>
      {pages.map(({ title, slug }) => (
        <Link key={slug} href={`/other/${slug}`}>
          <a className={styles.pageLink}>{title}</a>
        </Link>
      ))}
    </div>
  );
};

export const getStaticProps = async () => {
  const pages = await prisma.other_page.findMany({
    select: {
      title: true,
      slug: true,
      order: true,
    },
  });

  return {
    props: {
      pages: pages.sort((a, b) => a.order - b.order),
    },
    revalidate: 600, // sec
  };
};

export default OtherPage;
