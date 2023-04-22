import Link from 'next/link';
import { BsInstagram } from 'react-icons/bs';

import styles from './Info.module.scss';

type InfoTabProps = {
  country: string;
  city: string;
  age: number | null;
  height: number | string;
  yearsInTennis: number | null;
  jobDescription: string;
  gameplayStyle: string;
  forehand: string;
  beckhand: string;
  instaLink: string;
};

const InfoTab = ({
  country,
  city,
  age,
  height,
  jobDescription,
  yearsInTennis,
  gameplayStyle,
  forehand,
  beckhand,
  instaLink,
}: InfoTabProps) => (
  <>
    <div className={styles.infoRow}>
      <span>Город</span>
      <span>
        {country}, {city}
      </span>
    </div>
    {age && (
      <div className={styles.infoRow}>
        <span>Возраст</span>
        <span>{age}</span>
      </div>
    )}
    <div className={styles.infoRow}>
      <span>Рост</span>
      <span>{height} см</span>
    </div>
    <div className={styles.infoRow}>
      <span>Сфера деятельности</span>
      <span>{jobDescription}</span>
    </div>
    {!!yearsInTennis && (
      <div className={styles.infoRow}>
        <span>Лет в теннисе</span>
        <span>{yearsInTennis}</span>
      </div>
    )}
    <div className={styles.infoRow}>
      <span>Стиль игры</span>
      <span>{gameplayStyle}</span>
    </div>
    <div className={styles.infoRow}>
      <span>Форхэнд</span>
      <span>{forehand}</span>
    </div>
    <div className={styles.infoRow}>
      <span>Бэкхэнд</span>
      <span>{beckhand}</span>
    </div>
    <div className={styles.infoRow}>
      <span>Инстаграм</span>
      <span>
        {instaLink && (
          <Link href={instaLink}>
            <span>
              <BsInstagram /> {instaLink.split('https://www.instagram.com/')[1]}
            </span>
          </Link>
        )}
      </span>
    </div>
  </>
);

export default InfoTab;
