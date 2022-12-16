import styles from './News.module.scss';

type NewsTabProps = {

}
const NewsTab = (props: NewsTabProps) => {
  return (
    <div className={styles.newsTabContainer}>
      {[1, 2, 3].map((v) => (
        <div className={styles.article}>
          <div className={styles.header}>
            <span>Вторая травма ахила за выходные</span>
            <span>12.0{v * 3}.2022</span>
          </div>
          <p className={styles.preview}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa inventore maxime blanditiis neque, necessitatibus voluptates aspernatur magni similique atque, libero error ipsam dolore minima nihil obcaecati quia eos omnis magnam?</p>
        </div>
      ))}
    </div>
  )
};

export default NewsTab;
