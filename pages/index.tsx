import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import { MdIosShare } from 'react-icons/md';
import { HiDotsVertical } from 'react-icons/hi';
import { AiOutlineCloudDownload } from 'react-icons/ai';
import { BsApple } from 'react-icons/bs';
import { DiAndroid } from 'react-icons/di';

import styles from 'styles/Home.module.scss';

interface IShowInfo {
  apple: boolean,
  android: boolean,
  telegramLiga: boolean,
  instagram: boolean,
  youtube: boolean,
  tiktok: boolean,
  telVabish: boolean,
  telProzor: boolean,
  telegramVabish: boolean
}

type TypeIcons =
  'apple' 
| 'android'
| 'telegramLiga'
| 'instagram'
| 'youtube'
| 'tiktok'
| 'telVabish'
| 'telProzor'
| 'telegramVabish';


const HomePage: NextPage = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isShowText, setIsShowText] = useState<IShowInfo>({
    apple: false,
    android: false,
    telegramLiga: false,
    instagram: false,
    youtube: false,
    tiktok: false,
    telVabish: false,
    telProzor: false,
    telegramVabish: false
  });


  const handleShowInfo = (icon: TypeIcons) => {
    setIsShowText(prev => {
      const update: IShowInfo = {...prev}
      for(const key in update) {
        if (key === icon) {
          update[key as keyof IShowInfo] = !update[key as keyof IShowInfo];
        } else {
          update[key as keyof IShowInfo] = false;
        }
      }
      return update;
    })
  }
  

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

  return (
    <div className={styles.homePage}>
      <div className={styles.wrapperIcons}>
        <div className={styles.innerInstallIcons}>
          {deferredPrompt ? (
            <>
              <span>Скачать:</span>
              <a
                className={styles.installIcon} 
                onClick={handleInstallClick}>
                  <AiOutlineCloudDownload />
              </a>
          </>
            ) : (
              <>
                <div className={`${styles.infoIcon} ${isShowText.apple ? styles.active : ''}`}>
                    <BsApple onClick={() => handleShowInfo('apple')} />
                  {
                    isShowText.apple && (
                      <a className={styles.infoText}>
                        В Safari, нажмите на &nbsp; <MdIosShare className={styles.iconText} />
                        &nbsp; и на экран &#34;Домой&#34;
                      </a>
                    )
                  }
                </div>
                <div 
                  className={`${styles.infoIcon} ${isShowText.android ? styles.active : ''}`}>
                    <DiAndroid onClick={() => handleShowInfo('android')} />
                  {
                    isShowText.android && (
                      <a className={styles.infoText}>
                        В Chrome, нажмите <HiDotsVertical className={styles.iconText} />
                        и &#34;Установить&#34;
                      </a>
                    )
                  }
                </div>
              </>
          )}
        </div>
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
