import {NextPage} from 'next';
import styles from '../styles/Preview.module.scss'
import {BiArrowBack} from "react-icons/bi";

const Preview: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.blur}>
        <div className={styles.description}>
          <h2>Лига Тенниса <br/>Твои возможности</h2>
          <p>Лига Тенниса - это турниры по теннису различной категории для новичков, любителей и профессионалов в Минске
          </p>
        </div>
        <div className={styles.buttons}>
          <a className={styles.back}>
            <BiArrowBack size='xl'/>
          </a>
          <a className={styles.back}>
            <BiArrowBack size='xl'/>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Preview;