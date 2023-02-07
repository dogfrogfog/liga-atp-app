import { NextPage } from 'next';

import { prisma } from 'services/db';
import styles from 'styles/Home.module.scss';

// @ts-ignore
const HomePage: NextPage = ({ player, digests }) => {
  console.log(player, digests);
  return (
    <div className={styles.description}>
      <h3 className={styles.previeTitle}>Лига тенниса</h3>
      <p className={styles.secondaryDesc}>
        Лига Тенниса - это турниры по теннису различной категории для новичков,
        любителей и профессионалов в Минске
      </p>
    </div>
  );
};

export const getServerSideProps = async () => {
  const [player, digests] = await prisma.$transaction([
    prisma.player.findUnique({
      where: {
        id: 1,
      },
    }),
    prisma.digest.findMany({
      where: {
        mentioned_players_ids: {
          has: 1,
        },
      },
    }),
  ]);

  console.log(player,digests)

  return {
    props: {
      player,
      digests,
    },
  };
};

export default HomePage;
