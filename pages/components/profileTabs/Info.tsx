import { BsInstagram } from 'react-icons/bs'

import styles from './Info.module.scss'

const InfoTab = ({
  // id,
  // first_name,
  // last_name,
  // date_of_birth,
  // country,
  // email,
  // phone,
  // avatar,
  age,
  city,
  height,
  job_description,
  years_in_tennis,
  gameplay_style,
  forehand,
  beckhand,
  insta_link,
  // is_coach,
  // medals,
  // level
}: any) => (
  <>
    <div className={styles.infoRow}>
      <span>Город</span>
      <span>{city}</span>
    </div>
    <div className={styles.infoRow}>
      <span>Возраст</span>
      <span>{age} года</span>
    </div>
    <div className={styles.infoRow}>
      <span>Рост</span>
      <span>{height} см</span>
    </div>
    <div className={styles.infoRow}>
      <span>Сфера деятельности</span>
      <span>{job_description}</span>
    </div>
    <div className={styles.infoRow}>
      <span>Лет в теннисе</span>
      <span>{years_in_tennis} года</span>
    </div>
    <div className={styles.infoRow}>
      <span>Стиль игры</span>
      <span>{gameplay_style}</span>
    </div>
    <div className={styles.infoRow}>
      <span>Форхэнд</span>
      <span>{forehand}</span>
    </div>
    <div className={styles.infoRow}>
      <span>Бэкэнд</span>
      <span>{beckhand}</span>
    </div>
    <div className={styles.infoRow}>
      <span>Инстаграм</span>
      <span><BsInstagram /> {insta_link && insta_link.split('https://www.instagram.com/')[1]}</span>
    </div>
    {/* be able to chose from one of the players  */}
    {/* <div className={styles.coaching}>
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
    </div> */}
  </>
)

export default InfoTab