import type { NextPage, NextPageContext } from 'next';

import styles from 'styles/SingleDigestPage.module.scss';

const SingleDigestPage: NextPage<{ digest: any }> = ({ digest }) => {
  return (
    <div className={styles.сontainer}>
      <div className={styles.digestHeader}>
        <div className={styles.title}>{digest.title}</div>
        <span className={styles.date}>{digest.date}</span>
      </div>
      <div className={styles.content}>
        {new Array(5).fill(digest.text).map((v) => (
          <>
            {v}
            <br />
            <br />
          </>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = (ctx: NextPageContext) => {
  // should be prisma query
  const digest = {
    date: '11.02.1899',
    title: `Дайджест ${ctx.query.pid}`,
    text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Repellendus, autem est corrupti, pariatur dolores aspernatur nesciunt voluptatem corporis eaque eius harum. Tempora illum maiores nobis, suscipit voluptatum rerum iure eum!',
  };

  return {
    props: {
      digest,
    },
  };
};

export default SingleDigestPage;
