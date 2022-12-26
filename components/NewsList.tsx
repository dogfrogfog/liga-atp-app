import { Fragment } from 'react';

import styles from './NewsList.module.scss';

type NewsListProps = {
  news: { title: string; date: string; desc: string }[];
};

const NewsList = ({ news }: NewsListProps) => (
  <>
    {news.map((v) => (
      <Fragment key={v.title}>
        <div className={styles.imagePreview}></div>
        <div key={v.title} className={styles.article}>
          <div className={styles.header}>
            <span>{v.title}</span>
            <span>{v.date}</span>
          </div>
          <p className={styles.preview}>{v.desc}</p>
        </div>
      </Fragment>
    ))}
  </>
);

export default NewsList;
