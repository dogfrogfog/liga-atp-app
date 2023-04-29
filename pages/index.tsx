import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { DiSafari } from 'react-icons/di';
import { DiChrome } from 'react-icons/di';
import { DiOpera } from 'react-icons/di';
import { DiFirefox } from 'react-icons/di';
import { MdIosShare } from 'react-icons/md';
import { HiDotsVertical } from 'react-icons/hi';
import { AiOutlineCloudDownload } from 'react-icons/ai';

import styles from 'styles/Home.module.scss';

type TBrowser = 'Safari' | 'Chrome' | 'Firefox' | 'Opera';

const HomePage: NextPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isShowInfoSafari, setIsShowInfoSafari] = useState<boolean>(false);
  const [isShowInfoChrome, setIsShowInfoChrome] = useState<boolean>(false);
  const [isShowInfoOpera, setIsShowInfoOpera] = useState<boolean>(false);
  const [isShowInfoFirefox, setIsShowInfoFirefox] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleShowInfo = (browser: TBrowser) => {
    switch (browser) {
      case 'Safari': {
        if (isShowInfoChrome) {
          setIsShowInfoChrome(false);
          setIsShowInfoSafari(!isShowInfoSafari);
          break;
        }

        if (isShowInfoOpera) {
          setIsShowInfoOpera(false);
          setIsShowInfoSafari(!isShowInfoSafari);
          break;
        }

        if (isShowInfoFirefox) {
          setIsShowInfoFirefox(false);
          setIsShowInfoSafari(!isShowInfoSafari);
          break;
        }

        setIsShowInfoSafari(!isShowInfoSafari);
        break;
      }
      case 'Opera': {
        if (isShowInfoChrome) {
          setIsShowInfoChrome(false);
          setIsShowInfoOpera(!isShowInfoOpera);
          break;
        }

        if (isShowInfoSafari) {
          setIsShowInfoSafari(false);
          setIsShowInfoOpera(!isShowInfoSafari);
          break;
        }

        if (isShowInfoFirefox) {
          setIsShowInfoFirefox(false);
          setIsShowInfoOpera(!isShowInfoOpera);
          break;
        }

        setIsShowInfoOpera(!isShowInfoOpera);
        break;
      }
      case 'Chrome': {
        if (isShowInfoSafari) {
          setIsShowInfoSafari(false);
          setIsShowInfoChrome(!isShowInfoChrome);
          break;
        }

        if (isShowInfoOpera) {
          setIsShowInfoOpera(false);
          setIsShowInfoChrome(!isShowInfoChrome);
          break;
        }

        if (isShowInfoFirefox) {
          setIsShowInfoFirefox(false);
          setIsShowInfoChrome(!isShowInfoChrome);
          break;
        }

        setIsShowInfoChrome(!isShowInfoChrome);
        break;
      }
      case 'Firefox': {
        if (isShowInfoChrome) {
          setIsShowInfoChrome(false);
          setIsShowInfoFirefox(!isShowInfoFirefox);
          break;
        }

        if (isShowInfoOpera) {
          setIsShowInfoOpera(false);
          setIsShowInfoFirefox(!isShowInfoFirefox);
          break;
        }

        if (isShowInfoSafari) {
          setIsShowInfoSafari(false);
          setIsShowInfoFirefox(!isShowInfoFirefox);
          break;
        }

        setIsShowInfoFirefox(!isShowInfoFirefox);
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.wrapperIcons}>
        {deferredPrompt ? (
          <>
            <span>Установка: </span>
            <a
              className={styles.installIcon} 
              onClick={handleInstallClick}>
                <AiOutlineCloudDownload />
            </a>
        </>
          ) : (
            <>
              <span>Инструкция: </span>
              <div>
                <a 
                  className={`${styles.infoIcon} ${isShowInfoSafari ? styles.activeIcon : ''}`}>
                    <DiSafari onClick={() => handleShowInfo('Safari')} />
                  {
                    isShowInfoSafari && (
                      <p className={styles.infoText}>
                        Для установки приложения из Safari,
                        нажмите на <MdIosShare className={styles.iconText} />
                        внизу экрана, а затем на экран &#34;Домой&#34;
                      </p>
                    )
                  }
                </a>
                <a 
                  className={`${styles.infoIcon} ${isShowInfoChrome ? styles.activeIcon : ''}`}>
                    <DiChrome onClick={() => handleShowInfo('Chrome')} />
                  {
                    isShowInfoChrome && (
                      <p className={styles.infoText}>
                        Для установки приложения из Chrome, нажмите вверху экрана 
                        <HiDotsVertical className={styles.iconText} /> ,
                        а затем &#34;Установить приложение&#34;
                      </p>
                    )
                  }
                </a>
                <a 
                  className={`${styles.infoIcon} ${isShowInfoOpera ? styles.activeIcon : ''}`}>
                    <DiOpera onClick={() => handleShowInfo('Opera')} />
                  {
                    isShowInfoOpera && (
                      <p className={styles.infoText}>
                        Для установки приложения из Opera, нажмите вверху экрана 
                        <HiDotsVertical className={styles.iconText} /> ,
                        а затем &#34;главный экран&#34;
                      </p>
                    )
                  }
                </a>
                <a 
                  className={`${styles.infoIcon} ${isShowInfoFirefox ? styles.activeIcon : ''}`}>
                    <DiFirefox onClick={() => handleShowInfo('Firefox')} />
                  {
                    isShowInfoFirefox && (
                      <p className={styles.infoText}>
                        Для установки приложения из Firefox нужно установить расширение
                        &#34;Progressive Web Apps for Firefox&#34; и проследовать небольшой инструкции
                      </p>
                    )
                  }
                </a>
              </div>
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
