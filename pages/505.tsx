import type { NextPage } from 'next';

import styles from 'styles/errorPage.module.scss';

const FiveZeroFive: NextPage = () => {
  return (
    <div className={styles.pageContainer}>
      <p className={styles.mainText}>Упс....ошибка сервера</p>
      <p className={styles.secondaryText}>Что-то пошло не так</p>
    </div>
  );
};

export default FiveZeroFive;
