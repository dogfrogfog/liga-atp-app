import type { NextPage } from 'next';
import Link from 'next/link';

import styles from '../../styles/Tournaments.module.scss';

function createData(
  title: string,
  status: string,
  date: string,
  winners?: string
) {
  return { title, status, date, winners };
}

const tournamentData = [
  createData('SUPER CHALLENGER 9| 2022', 'Запись', '01.09.2022'),
  createData('SUPER MASTERS ROLAND GARROS | 2022', 'Запись', '01.09.2022'),
  createData('US OPEN SUPERMASTERS | 2022', 'Идет', '01.09.2022'),
  createData('LEGGER - 12 | 2022', '', '01.09.2022', 'Карлашов А, Радькова Т'),
  createData(
    'SUPER CHALLENGER 8| 2022',
    '',
    '01.09.2022',
    'Карлашов А, Радькова Т'
  ),
];

const TournamentsPage: NextPage = () => {
  return (
    <div className={styles.container}>
      {tournamentData.map(({ title, status, date, winners }, index) => (
        <Link key={index} href={'/tournaments/' + index}>
          <div className={styles.tournamentListItem}>
            <div>
              <span>{title}</span>
              {status && <span className={styles.status}>{status}</span>}
            </div>
            <div>
              <span>{date}</span>
              {winners && <span>{winners}</span>}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TournamentsPage;
