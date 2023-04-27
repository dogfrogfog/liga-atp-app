import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import {GoCloudDownload} from 'react-icons/go'

import styles from 'styles/Home.module.scss';


const HomePage: NextPage = () => {

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    console.log("work");
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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      console.log(`User ${choiceResult.outcome}`);
      setDeferredPrompt(null);
    }
  };

  return (
    <div className={styles.homePage}>
      <div className={styles.description}>
        {deferredPrompt &&
          <a onClick={handleInstallClick}>
            <GoCloudDownload size={35} color="#4cc4d1" />
          </a>
        }
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
