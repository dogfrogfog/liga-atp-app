import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import type { digest as DigestT } from '@prisma/client';
import { MultiSelect, Option } from 'react-multi-select-component';
import axios from 'axios';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import LoadingSpinner from 'ui-kit/LoadingSpinner';
import usePlayers from 'hooks/usePlayers';
import { playersToMultiSelect, multiSelectToIds } from 'utils/multiselect';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

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

type NoCustomFieldsType = Omit<
  DigestT,
  'id' | 'makrdown' | 'mentioned_players_ids'
>;

const CreateDigestPage: NextPage = () => {
  const { players } = usePlayers();
  const router = useRouter();
  const [newSelectedPlayers, setNewSelectedPlayers] = useState<Option[]>([]);
  const [markdown, setMarkdown] = useState<string | undefined>();

  const { register, handleSubmit } = useForm<NoCustomFieldsType>({
    defaultValues: {
      date: null,
    },
  });

  const onSubmit = async (formData: NoCustomFieldsType) => {
    const res = await createDigests({
      ...formData,
      markdown: markdown || null,
      mentioned_players_ids: multiSelectToIds(newSelectedPlayers),
    });

    if (res.isOk) {
      router.push(`/admin/digests/${res.data?.id}`);
    } else {
      console.error(res.errorMessage);
    }
  };

  return (
    <div className={styles.createPageContainer}>
      <PageTitle>Новый дайджест</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.sidesContainer}>
          <div className={styles.side}>
            <input
              className={styles.inputField}
              type="date"
              {...register('date', {
                required: true,
                valueAsDate: true,
              })}
            />
            <input
              className={styles.inputField}
              placeholder="Заголовок"
              {...register('title', {
                required: true,
              })}
            />
          </div>
          <div className={styles.side}>
            <MultiSelect
              disabled={false}
              options={playersToMultiSelect(players)}
              value={newSelectedPlayers}
              onChange={setNewSelectedPlayers}
              labelledBy="Выбирите игроков из списка"
            />
          </div>
        </div>
        <div data-color-mode="light" className={styles.markdownWrapper}>
          <MDEditor value={markdown} onChange={setMarkdown} />
        </div>
        <button className={styles.submitButton} type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default CreateDigestPage;
