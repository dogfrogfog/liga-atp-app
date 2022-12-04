import type { NextPage } from 'next';
import Link from 'next/link';

import styles from '../styles/Home.module.css';

const Elo: NextPage = () => {
  return (
    <div className={styles.container}>
      <br />
      <br />
      <div>
        <span
          style={{ padding: 5, backgroundColor: '#4CC4D1', marginRight: 10 }}
        >
          Masters
        </span>
        <span
          style={{ padding: 5, backgroundColor: '#4CC4D1', marginRight: 10 }}
        >
          Leger
        </span>
        <span
          style={{ padding: 5, backgroundColor: '#4CC4D1', marginRight: 10 }}
        >
          Challenger
        </span>
        <span
          style={{ padding: 5, backgroundColor: '#4CC4D1', marginRight: 10 }}
        >
          Futures
        </span>
      </div>
      <br />
      <br />
      <br />
      <h3>Таблица рейтинга Эло</h3>
      <p
        style={{
          padding: 5,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Ермакович Вмитрий</span>
        <span>Masters</span>
        <span>2022</span>
      </p>
      <p
        style={{
          padding: 5,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Ермакович Вмитрий</span>
        <span>Masters</span>
        <span>2022</span>
      </p>
      <p
        style={{
          padding: 5,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Ермакович Вмитрий</span>
        <span>Masters</span>
        <span>2022</span>
      </p>
      <p
        style={{
          padding: 5,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Ермакович Вмитрий</span>
        <span>Masters</span>
        <span>2022</span>
      </p>
      <p
        style={{
          padding: 5,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Ермакович Вмитрий</span>
        <span>Masters</span>
        <span>2022</span>
      </p>
      <p
        style={{
          padding: 5,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Ермакович Вмитрий</span>
        <span>Masters</span>
        <span>2022</span>
      </p>
      <p
        style={{
          padding: 5,
          marginBottom: 10,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>Ермакович Вмитрий</span>
        <span>Masters</span>
        <span>2022</span>
      </p>
    </div>
  );
};

export default Elo;
