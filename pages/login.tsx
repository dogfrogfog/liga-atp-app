import { NextPage } from 'next';
import styles from '../styles/LoginPage.module.scss';
import { BiArrowBack } from "react-icons/bi";

const LoginPage: NextPage = () => {
  return (
    <div className={styles.container}>
      <BiArrowBack className={styles.back} size='xl'/>
      <div className={styles.section}>
        <div className={styles.info}>
          <h1>Лига Тенниса</h1>
          <p>Чтобы получить доступ к перечень турниров и тренировок, а также список тренерского штаба, необходимо войти в систему, либо зарегистрироваться</p>
        </div>
        <div className={styles.buttons}>
          <button className={styles.login}>Войти в аккаунт</button>
          <button className={styles.signup}>Регистрация</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;