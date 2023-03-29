import type { NextPage } from 'next';

import styles from 'styles/errorPage.module.scss';

const FourZeroFour: NextPage = () => {
  return (
    <div className={styles.pageContainer}>
      <p className={styles.mainText}>Упс....ошибка 404</p>
      <p className={styles.secondaryText}>Что-то пошло не так</p>
      <p className={styles.secondaryText}>попробуйте позже</p>
    </div>
  );
};

export default FourZeroFour;
