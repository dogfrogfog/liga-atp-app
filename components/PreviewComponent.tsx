import { GiTennisBall } from 'react-icons/gi';
import { GiTennisRacket } from 'react-icons/gi';

import styles from './PreviewComponent.module.scss';

interface IPreviewComponentProps {
  title: string;
}

const PreviewComponent = ({ title }: IPreviewComponentProps) => (
  <div className={styles.container}>
    <div className={styles.blur}>
      <div className={styles.description}>
        <h3 className={styles.previeTitle}>{title}</h3>
        <h6>Лига Тенниса <br />Твои возможности</h6>
        <p>
          Лига Тенниса - это турниры по теннису различной категории для новичков,
          любителей и профессионалов в Минске
        </p>
      </div>
      <div className={styles.buttons}>
        <a className={styles.back}>
          <GiTennisRacket size='xl' />
        </a>
        <a className={styles.back}>
          <GiTennisBall size='xl' />
        </a>
      </div>
    </div>
  </div>
);

export default PreviewComponent;