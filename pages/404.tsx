import type { NextPage } from 'next';

import styles from 'styles/errorPage.module.scss';

const FourZeroFour: NextPage = () => {
  return (
    <div className={styles.pageContainer}>
      <p className={styles.mainText}>Упс....ошибка 404</p>
      <p className={styles.secondaryText}>Страница не существует или</p>
      <p className={styles.secondaryText}>что-то пошло не так</p>
    </div>
  );
};

export default FourZeroFour;
