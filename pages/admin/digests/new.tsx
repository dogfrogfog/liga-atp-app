import { useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { digest as DigestT } from '@prisma/client';
import type { Option } from 'react-multi-select-component';
import axios from 'axios';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import DigestForm from 'components/admin/DigestForm';
import usePlayers from 'hooks/usePlayers';
import { multiSelectToIds } from 'utils/multiselect';

const createDigests = async (
  data: Omit<DigestT, 'id'>
): Promise<{ isOk: boolean; errorMessage?: string; data?: DigestT }> => {
  const response = await axios.post<DigestT>('/api/digests/new', { data });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

import PageTitle from 'ui-kit/PageTitle';
import styles from './styles.module.scss';
import useDigests from 'hooks/useDigests';

export type NoCustomFieldsType = Omit<
  DigestT,
  'id' | 'makrdown' | 'mentioned_players_ids'
>;

const CreateDigestPage: NextPage = () => {
  const { players } = usePlayers();
  const router = useRouter();
  const { mutate } = useDigests();

  const [newSelectedPlayers, setNewSelectedPlayers] = useState<Option[]>([]);
  const [markdown, setMarkdown] = useState<string | undefined>();

  const onSubmit = async (formData: NoCustomFieldsType) => {
    const res = await createDigests({
      ...formData,
      markdown: markdown || null,
      mentioned_players_ids: multiSelectToIds(newSelectedPlayers),
    });

    if (res.isOk) {
      router.push(`/admin/digests/${res.data?.id}`);
      mutate();
    } else {
      console.error(res.errorMessage);
    }
  };

  return (
    <div className={styles.createPageContainer}>
      <PageTitle>Новый дайджест</PageTitle>
      <DigestForm
        players={players}
        onSubmit={onSubmit}
        markdown={markdown}
        setMarkdown={setMarkdown}
        newSelectedPlayers={newSelectedPlayers}
        setNewSelectedPlayers={setNewSelectedPlayers}
      />
    </div>
  );
};

export default CreateDigestPage;
