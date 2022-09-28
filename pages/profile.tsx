import { useState } from 'react'
import type { NextPage } from 'next'
import Link from 'next/link'
import cl from 'classnames'

import styles from '../styles/Profile.module.scss'

const mockInfo = [
  {
    name: 'Город',
    value: 'Минск',
  },
  {
    name: 'Возраст',
    value: '32 года',
  },
  {
    name: 'Рост',
    value: '199 см',
  },
  {
    name: 'Лет в теннисе',
    value: '4 года',
  },
  {
    name: 'Форхэнд',
    value: 'Правая рука',
  },
  {
    name: 'Бэкэнд',
    value: 'Двуручный',
  },
  {
    name: 'Инста',
    value: '@',
  },
  {
    name: 'Техничность',
    value: '65 %',
  },
]

const Profile: NextPage = () => {
  const [activeTab, setActiveTab] = useState('Информация');

  const activeTabContent = (() => {
    switch (activeTab) {
      case 'Информация':
        return (
          <div className={styles.info}>
            {mockInfo.map(({ name, value }) => (
              <div className={styles.infoRow}>
                <span>{name}</span>
                <span>{value}</span>
              </div>
            ))}
            <div className={cl(styles.infoRow, styles.coachRow)}>
              <span className={styles.title}>Тренер</span>
              <span className={styles.name}>Кравченко Сергей</span>
            </div>
            <div className={cl(styles.infoRow, styles.coachRow)}>
              <span className={styles.title}>Ученик</span>
              <span className={styles.name}>Кравченко Сергей</span>
              <span className={styles.name}>Кравченко Сергей</span>
            </div>
          </div>
        );
      case 'Расписание':
        return (
          <div>
            <div style={{ display: 'flex', marginBottom: 30 }}>
              {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС', 'ПН', 'ВТ'].map((day) => (
                <span style={{ padding: 5, marginRight: 5, backgroundColor: 'lightgrey' }}>{day}</span>
              ))}
            </div>
            <div>
              {[1, 2, 3].map((day) => (
                <div style={{ marginBottom: 40 }}>
                  <p>DOUBLES FUTURES 23 | 2022</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span>16.00</span>
                   <span>Усманов В, Кравченок У</span>
                  </div>
                  <div style={{ display: 'flex',  justifyContent: 'space-between' }}>
                  <span>7 корт</span>
                   <span>Кураш На, Полном Кураже</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'Встречи':
        return (
          <div>
            {[1, 2, 3].map(() => (
              <>
                <div>
                  <p>14.05.2022</p>
                  <p>Challenger</p>
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Марьянович</span>
                    <span>6-4 6-4 6-4</span>
                  </p>
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>youtube</span>
                    <span>H2H</span>
                  </p>
                </div>
                <br />
                <br />
              </>
            ))}
          </div>
        );
      case 'Статистика':
        return (
          <div>
            <p>график изменения ЭЛО</p>
            <br />
            <p>статистика</p>
            <p>статистика</p>
            <p>статистика</p>
            <p>статистика</p>
            <p>статистика</p>
            <p>статистика</p>
            <p>статистика</p>
            <p>статистика</p>
          </div>
        );
      default:
        return null;
    }
  })();

  return (
    <div className={styles.profileContainer}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <div><Link href="/">back</Link></div>
          <div>status</div>
        </div>
        <div className={styles.playerInfo}>
          <h3>Маша Шарапова</h3>
          <div className={styles.achievements}>
            <div className={styles.rank}>
              <span>10</span>
              <span>Супермастерс</span>
            </div>
            <div className={styles.medal}>@ 3</div>
            <div className={styles.medal}>@ 8</div>
          </div>
        </div>
      </div>
      <section>
        <div className={styles.menu}>
          {['Информация', 'Расписание', 'Встречи', 'Статистика'].map((menuItem) => (
            <div onClick={() => setActiveTab(menuItem)} className={styles.menuItem}>
              {menuItem}
            </div>
          ))}
        </div>
        {activeTabContent}
      </section>
    </div>

  )
}

export default Profile
