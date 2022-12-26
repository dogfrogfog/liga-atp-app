import Link from 'next/link';
import { Fragment } from 'react';

import styles from './NewsList.module.scss';

type NewsListProps = {
  news: { title: string; date: string; desc: string; id: number }[];
};

const NewsList = ({ news }: NewsListProps) => (
  <>
    {news.map((v) => (
      <Link key={v.title} href={`digest/${v.id}`}>
        <Fragment>
          <div className={styles.imagePreview}></div>
          <div key={v.title} className={styles.article}>
            <p className={styles.title}>{v.title}</p>
            <p className={styles.desc}>{v.desc}</p>
            <span className={styles.date}>{v.date}</span>
          </div>
        </Fragment>
      </Link>
    ))}
  </>
);

export default NewsList;
