import Link from 'next/link';
import { Fragment } from 'react';

import styles from './NewsList.module.scss';

type NewsListProps = {
  news: { title: string; date: string; desc: string; id: number }[];
};

const NewsList = ({ news }: NewsListProps) => (
  <>
    {news.map((v, i) => (
      <Fragment key={v.id + i}>
        <div className={styles.imagePreview}></div>
        <div key={v.title} className={styles.article}>
          <Link href={`digest/${v.id}`}>
            <p className={styles.title}>{v.title}</p>
          </Link>
          <p className={styles.desc}>{v.desc}</p>
          <span className={styles.date}>{v.date}</span>
        </div>
      </Fragment>
    ))}
  </>
);

export default NewsList;
