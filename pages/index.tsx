import { NextPage } from 'next';
import Link from 'next/link';

import styles from './Home.module.scss';

const HomePage: NextPage = () => {
  return (
    <div className={styles.homePageContainer}>
      <div className={styles.description}>
        <h3 className={styles.previeTitle}>Лига тенниса</h3>
        <h6>
          Лига Тенниса <br />
          Твои возможности
        </h6>
        <p className={styles.secondaryDesc}>
          Лига Тенниса - это турниры по теннису различной категории для
          новичков, любителей и профессионалов в Минске
        </p>
        <div className={styles.buttons}>
          <Link href="/players">
            <span>Список игроков</span>
          </Link>
          <Link href="/tournaments">
            <span>Список турниров</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
