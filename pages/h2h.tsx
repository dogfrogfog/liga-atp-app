import type { NextPage } from 'next';
import { useRouter } from 'next/router'

import styles from '../styles/Home.module.css';

const h2h: NextPage = () => {
  const { query: { player1Id, player2Id } } = useRouter();

  console.log(player1Id, player2Id);

  return (
    <div className={styles.container}>
      <h1>head to head page</h1>
    </div>
  );
};

export default h2h;
