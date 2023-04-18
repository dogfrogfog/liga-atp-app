import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { MultiSelect, Option } from 'react-multi-select-component';
import type { player as PlayerT } from '@prisma/client';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import LoadingSpinner from 'ui-kit/LoadingSpinner';
import { playersToMultiSelect } from 'utils/multiselect';
import type { NoCustomFieldsType } from 'pages/admin/digests/new';

import styles from './DigestForm.module.scss';
import { Dispatch, SetStateAction } from 'react';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

type DigestFormProps = {
  players: PlayerT[];
  onSubmit: (v: NoCustomFieldsType) => Promise<void>;
  markdown?: string;
  setMarkdown: Dispatch<SetStateAction<string | undefined>>;
  newSelectedPlayers: Option[];
  setNewSelectedPlayers: Dispatch<SetStateAction<Option[]>>;
  defaultValues?: any;
};

const DigestForm = ({
  defaultValues,
  players,
  onSubmit,
  markdown,
  setMarkdown,
  newSelectedPlayers,
  setNewSelectedPlayers,
}: DigestFormProps) => {
  const { register, handleSubmit } = useForm<NoCustomFieldsType>({
    defaultValues: {
      date: null,
      ...defaultValues,
    },
  });

  return (
    <form className={styles.digestForm} onSubmit={handleSubmit(onSubmit)}>
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
            labelledBy="Выберите игроков из списка"
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
  );
};

export default DigestForm;
