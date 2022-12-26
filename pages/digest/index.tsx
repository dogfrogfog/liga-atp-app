import type { NextPage } from 'next';

import NewsList from 'components/NewsList';
import styles from 'styles/Digest.module.scss';

const DigestPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <p className={styles.pageTitle}>Дайджест</p>
      <NewsList
        news={new Array(3).fill({
          title: 'Вторая травма ахила за неделю',
          date: '11.11.2022',
          desc: 'Lorem ipsum dolor sit amet, con',
          id: Math.round(Math.random() * 100),
        })}
      />
    </div>
  );
};

export default DigestPage;
