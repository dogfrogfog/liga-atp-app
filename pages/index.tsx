import { NextPage } from 'next';

import styles from 'styles/Home.module.scss';

const HomePage: NextPage = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.description}>
        <h3 className={styles.previeTitle}>ЛИГА ТЕННИСА</h3>
        <p className={styles.secondaryDesc}>
          Комьюнити классных людей вокруг тенниса с еженедельными турнирами для
          новичков, любителей и бывших про Более 2000 участников.
          <br />
          <br />
          Онлайн-трансляции, статистика и история всех матчей.
          <br />
          <br />
          Основана в 2013 г
        </p>
      </div>
    </div>
  );
};

export default HomePage;
