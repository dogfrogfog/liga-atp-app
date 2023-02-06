import { NextPage } from 'next';

import styles from 'styles/Home.module.scss';

const HomePage: NextPage = () => {
  return (
    <div className={styles.description}>
      <h3 className={styles.previeTitle}>Лига тенниса</h3>
      <p className={styles.secondaryDesc}>
        Лига Тенниса - это турниры по теннису различной категории для новичков,
        любителей и профессионалов в Минске
      </p>
    </div>
  );
};

export default HomePage;
