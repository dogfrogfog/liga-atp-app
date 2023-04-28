import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { BsApple } from 'react-icons/bs';
import { DiAndroid } from 'react-icons/di';
import { MdIosShare } from 'react-icons/md';
import { HiDotsVertical } from 'react-icons/hi';

import styles from 'styles/Home.module.scss';

const HomePage: NextPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isShowInfoIOS, setIsShowInfoIOS] = useState<boolean>(false);
  const [isShowInfoAndroid, setIsShowInfoAndroid] = useState<boolean>(false);

  console.log(deferredPrompt);

  useEffect(() => {
    console.log('in use effect');

    const handleBeforeInstallPrompt = (event: Event) => {
      console.log('handleBeforeInstallPrompt');
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    console.log('in use effect 2');
    return () => {
      console.log('in return');
      
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    console.log(choiceResult);
    
    if (choiceResult.outcome === 'accepted') {
      setDeferredPrompt(null);
      return;
    }

    return;
  };

  const handleShowInfoIOS = () => {
    if(isShowInfoAndroid) {
      setIsShowInfoAndroid(false);
    }
    setIsShowInfoIOS(!isShowInfoIOS)
  }

  const handleShowInfoAndroid = () => {
    if(isShowInfoIOS) {
      setIsShowInfoIOS(false);
    }
    setIsShowInfoAndroid(!isShowInfoAndroid);
  }

  return (
    <div className={styles.homePage}>
      <div className={styles.wrapperIcons}>
        {deferredPrompt ? (
          <>
            <a 
              className={styles.installIconIOS} 
              onClick={handleInstallClick}>
                <BsApple />
            </a>
            <a 
              className={styles.installIconAndroid} 
              onClick={handleInstallClick}>
                <DiAndroid />
            </a>
          </>
          ) : (
            <>
              <a 
                className={`${styles.infoIconIOS} ${isShowInfoIOS ? styles.activeIcon : ''}`}>
                  <BsApple onClick={handleShowInfoIOS} />
                {
                  isShowInfoIOS && (
                    <p className={styles.infoIOS}>
                      Для установки <br />
                      приложения <br />
                      на IOS, нажмите на <MdIosShare className={styles.iconText} /> <br />
                      внизу экрана, а затем <br />
                      на экран &#34;Домой&#34;
                    </p>
                  )
                }
              </a>
              <a 
                className={`${styles.infoIconAndroid} ${isShowInfoAndroid ? styles.activeIcon : ''}`}>
                  <DiAndroid onClick={handleShowInfoAndroid} />
                {
                  isShowInfoAndroid && (
                    <p className={styles.infoAndroid}>
                      Для установки <br />
                      приложения <br />
                      на ANDROID, нажмите вверху экрана 
                      <HiDotsVertical className={styles.iconText} /> ,<br />
                      а затем &#34;Установить приложение&#34;
                    </p>
                  )
                }
              </a>
            </>
        )}
      </div>
      <div className={styles.description}>
        <h3 className={styles.previeTitle}>ЛИГА ТЕННИСА</h3>
        <p className={styles.secondaryDesc}>
          Комьюнити классных людей вокруг тенниса с еженедельными турнирами для
          новичков, любителей и бывших про
          <br />
          <br />
          Более 2000 участников
          <br />
          <br />
          Онлайн-трансляции, статистика и история всех матчей
          <br />
          <br />
          Основана в 2013 г
        </p>
      </div>
    </div>
  );
};

export default HomePage;
