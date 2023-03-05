import LoadingSpinner from 'ui-kit/LoadingSpinner';

import styles from './LoadingShadow.module.scss';

const LoadingShadow = () =>
  <div className={styles.loadingShadow}>
    <div className={styles.spinner}>
      <LoadingSpinner />
    </div>
  </div>;

export default LoadingShadow;
