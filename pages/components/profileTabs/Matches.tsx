import styles from './Matches.module.scss'

const Match = ({ }) => (
  <div className={styles.match}>
    <span className={styles.title}>Double Futures 23 | 2022</span>
    <div className={styles.row}>
      <span className={styles.time}>29.03 16:00</span>
      <span className={styles.pair}>Усманов Р, Кравченко Д</span>
    </div>
    <div className={styles.row}>
      <span className={styles.court}>7 корт</span>
      <span className={styles.pair}>Усманов Р, Кравченко Д</span>
    </div>
  </div>
);

const MatchesTab = () => (
  <>
    <Match />
    <Match />
    <Match />
    <Match />
  </>
)

export default MatchesTab