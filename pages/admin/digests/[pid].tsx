import type { NextPage, NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import type { digest as DigestT, player as PlayerT } from '@prisma/client';
import { format } from 'date-fns';

import LoadingSpinner from 'ui-kit/LoadingSpinner';
import { prisma } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import styles from './styles.module.scss';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const SingleDigestPage: NextPage<{ digest: DigestT; players: PlayerT[] }> = ({
  digest,
  players,
}) => {
  return (
    <div className={styles.singleDigestPage}>
      <PageTitle>{digest.title}</PageTitle>
      <p className={styles.digestDate}>
        {digest.date && format(digest.date, 'dd-MM-yyyy')}
      </p>
      <MarkdownPreview source={digest.markdown || ''} />
      <br />
      <p>Упомянутые игроки:</p>
      <div>
        {players.map((p) => (
          <span key={p.id} className={styles.mentionedPlayer}>
            {p.first_name} {p.last_name}
          </span>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const digest = await prisma.digest.findUnique({
    where: {
      id: parseInt(ctx.query.pid as string),
    },
  });

  const players = digest?.mentioned_players_ids
    ? await prisma.player.findMany({
        where: {
          id: {
            in: digest?.mentioned_players_ids,
          },
        },
      })
    : [];

  return {
    props: {
      digest,
      players,
    },
  };
};

export default SingleDigestPage;
