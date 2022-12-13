import styles from './styles.module.scss';

const LoadingSpinner = () => {
  return (
    <div className={styles.loadingSpinnerContainer}>
      <div className={styles.loadingSpinner}></div>
    </div>
  );
};

export default LoadingSpinner;
