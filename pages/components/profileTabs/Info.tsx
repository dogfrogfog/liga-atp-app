import { BsInstagram } from 'react-icons/bs'

import styles from './Info.module.scss'

const InfoTab = () => (
  <>
    <div className={styles.infoRow}>
      <span>Город</span>
      <span>Минск</span>
    </div>
    <div className={styles.infoRow}>
      <span>Возраст</span>
      <span>32 года</span>
    </div>
    <div className={styles.infoRow}>
      <span>Рост</span>
      <span>184 см</span>
    </div>
    <div className={styles.infoRow}>
      <span>Лет в теннисе</span>
      <span>4 года</span>
    </div>
    <div className={styles.infoRow}>
      <span>Форхэнд</span>
      <span>Правая рука</span>
    </div>
    <div className={styles.infoRow}>
      <span>Бэкэнд</span>
      <span>Двуручный</span>
    </div>
    <div className={styles.infoRow}>
      <span>Инстаграм</span>
      <span><BsInstagram /></span>
    </div>
    <div className={styles.infoRow}>
      <span>Город</span>
      <span>Минск</span>
    </div>
    <div className={styles.coaching}>
      <span className={styles.title}>
        Тренер
      </span>
      <div className={styles.infoRow}>
        <span>Город</span>
        <span>1444</span>
      </div>
    </div>
    <div className={styles.coaching}>
      <span className={styles.title}>
        Тренер
      </span>
      <div className={styles.infoRow}>
        <span>Город</span>
        <span>1444</span>
      </div>
      <div className={styles.infoRow}>
        <span>Город</span>
        <span>1444</span>
      </div>
    </div>
  </>
)

export default InfoTab