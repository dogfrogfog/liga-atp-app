import type { NextPage } from 'next';

import NewsList from 'components/NewsList';
import PageTitle from 'ui-kit/PageTitle';
import styles from 'styles/Digest.module.scss';

const DigestPage: NextPage = () => {
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Дайджест</PageTitle>
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
