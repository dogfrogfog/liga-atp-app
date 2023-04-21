import styles from './styles.module.scss';

const LoadingSpinner = () => {
  return (
    <div className={styles.skCubeGrid}>
      <div className={`${styles.skCube} ${styles.skCube1}`}></div>
      <div className={`${styles.skCube} ${styles.skCube2}`}></div>
      <div className={`${styles.skCube} ${styles.skCube3}`}></div>
      <div className={`${styles.skCube} ${styles.skCube4}`}></div>
      <div className={`${styles.skCube} ${styles.skCube5}`}></div>
      <div className={`${styles.skCube} ${styles.skCube6}`}></div>
      <div className={`${styles.skCube} ${styles.skCube7}`}></div>
      <div className={`${styles.skCube} ${styles.skCube8}`}></div>
      <div className={`${styles.skCube} ${styles.skCube9}`}></div>
    </div>
  );
};

export default LoadingSpinner;
