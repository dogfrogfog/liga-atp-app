import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { format } from 'date-fns';
import type { digest as DigestT, player as PlayerT } from '@prisma/client';
import type { NextPage, NextPageContext } from 'next';
import type { Option } from 'react-multi-select-component';

import LoadingSpinner from 'ui-kit/LoadingSpinner';
import { prisma } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import DigestForm from 'components/admin/DigestForm';
import type { NoCustomFieldsType } from 'pages/admin/digests/new';
import { multiSelectToIds, playersToMultiSelect } from 'utils/multiselect';
import styles from './styles.module.scss';
import { updateDigest, deleteDigest } from 'services/digests';
import usePlayers from 'hooks/usePlayers';
import useDigests from 'hooks/useDigests';

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const SingleDigestPage: NextPage<{
  digest: DigestT;
  mentionedPlayers: PlayerT[];
}> = ({ digest, mentionedPlayers }) => {
  const router = useRouter();
  const { players } = usePlayers();
  const { mutate } = useDigests();
  const [activeDigest, setActiveDigest] = useState(digest);
  const [isEditing, setEditingStatus] = useState(false);
  const [newSelectedPlayers, setNewSelectedPlayers] = useState<Option[]>(
    playersToMultiSelect(mentionedPlayers)
  );
  const [markdown, setMarkdown] = useState<string | undefined>(
    digest.markdown as string
  );

  const reset = () => {
    setActiveDigest(digest);
    setEditingStatus(false);
  };

  const onSubmit = async (formData: NoCustomFieldsType) => {
    const res = await updateDigest({
      id: digest.id,
      ...formData,
      markdown: markdown || null,
      mentioned_players_ids: multiSelectToIds(newSelectedPlayers),
    });

    if (res.isOk) {
      setActiveDigest(res.data as DigestT);
      mutate();
    } else {
      console.error(res.errorMessage);
    }

    setEditingStatus(false);
  };

  const edit = () => {
    setEditingStatus(true);
  };

  const handleDeleteClick = async () => {
    const { isOk } = await deleteDigest(activeDigest.id);

    if (isOk) {
      mutate();

      router.push('/admin/digests');
    }
  };

  return (
    <div className={styles.singleDigestPage}>
      <div className={styles.buttons}>
        <button className={styles.delete} onClick={handleDeleteClick}>
          Удалить
        </button>
        {!isEditing && (
          <button className={styles.action} onClick={edit}>
            Изменить
          </button>
        )}
        {isEditing && (
          <button className={styles.reset} onClick={reset}>
            Отменить
          </button>
        )}
      </div>
      {isEditing ? (
        <DigestForm
          defaultValues={{
            title: activeDigest.title,
            date: format(new Date(activeDigest?.date as Date), 'yyyy-MM-dd'),
          }}
          players={players}
          onSubmit={onSubmit}
          markdown={markdown}
          setMarkdown={setMarkdown}
          newSelectedPlayers={newSelectedPlayers}
          setNewSelectedPlayers={setNewSelectedPlayers}
        />
      ) : (
        <>
          <PageTitle>{activeDigest.title}</PageTitle>
          <p className={styles.digestDate}>
            {activeDigest.date &&
              format(new Date(activeDigest.date), 'dd-MM-yyyy')}
          </p>
          <MarkdownPreview source={activeDigest.markdown || ''} />
          <br />
          <p>Упомянутые игроки:</p>
          <div>
            {newSelectedPlayers.map((p) => (
              <span key={p.value} className={styles.mentionedPlayer}>
                {p.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const digest = await prisma.digest.findUnique({
    where: {
      id: parseInt(ctx.query.pid as string),
    },
  });

  const mentionedPlayers = digest?.mentioned_players_ids
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
      mentionedPlayers,
    },
  };
};

export default SingleDigestPage;
