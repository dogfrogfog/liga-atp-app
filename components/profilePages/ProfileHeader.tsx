import { useRouter } from 'next/router'
import { BiArrowBack } from 'react-icons/bi'
import { FaMedal } from 'react-icons/fa'

import styles from './ProfileHeader.module.scss'

const ProfileHeader = () => {
  const router = useRouter()

  return (
    <div className={styles.header}>
      <div className={styles.top}>
        <a className={styles.back} onClick={() => router.back()}>
          <BiArrowBack size='xl' />
        </a>
        <span className={styles.status}>Тренер</span>
      </div>
      <div className={styles.bottom}>
        <p className={styles.title}>Маша Архаменко</p>
        <div className={styles.infoContainer}>
          <div className={styles.achievements}>
            <div className={styles.rank}>
              <span className={styles.position}>10</span>
              <span className={styles.positionName}>Супермастерс</span>
            </div>
            <div className={styles.medal}>
              <FaMedal color='yellow' />
              3
            </div>
            <div className={styles.medal}>
              <FaMedal color='lightgrey' />
              6
            </div>
          </div>
          <span className={styles.elo}>1444</span>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader