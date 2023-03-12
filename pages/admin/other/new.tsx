import { useState } from 'react';
import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import slug from 'slug';
import axios from 'axios';
import type { other_page as OtherPageT } from '@prisma/client';
import LoadingSpinner from 'ui-kit/LoadingSpinner';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import styles from 'styles/NewOtherPage.module.scss';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const createOtherPage = async (
  data: Omit<OtherPageT, "id">
): Promise<{ isOk: boolean; errorMessage?: string; data?: Omit<OtherPageT, 'id'> }> => {
  const response = await axios.post<Omit<OtherPageT, 'id'>>('/api/otherPages/new', { data });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

import PageTitle from 'ui-kit/PageTitle';
import useOtherPages from 'hooks/useOtherPages';

const CreateOtherPagePage: NextPage = () => {
  const [markdown, setMarkdown] = useState<string>('');
  const router = useRouter();
  const { mutate } = useOtherPages();
  const { register, handleSubmit } = useForm<Omit<OtherPageT, "id" | "slug" | "markdown">>();
  
  const onSubmit = async (formData: Omit<OtherPageT, "id" | "slug" | "markdown">) => {
    const res = await createOtherPage({
        ...formData,
        markdown,
        slug: slug(formData.title as string),
    });

    if (res.isOk) {
      router.push(`/admin/other/${res.data?.slug}`);
      mutate();
    } else {
      console.error(res.errorMessage);
    }
  };

  return (
    <>
      <PageTitle>Новая страница прочее</PageTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
            className={styles.inputField}
            placeholder="Заголовок"
            {...register('title', {
            required: true,
            })}
        />
        <div data-color-mode="light" className={styles.markdownWrapper}>
            {/* @ts-ignore */}
            <MDEditor value={markdown} onChange={setMarkdown} />
        </div>
        <button className={styles.save} type="submit">
            Сохранить
        </button>
    </form>
    </>
  );
};

export default CreateOtherPagePage;
