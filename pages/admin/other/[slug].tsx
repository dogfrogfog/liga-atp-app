import type { NextPage, NextPageContext } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useRouter } from 'next/router';
import slug from 'slug';
import type { other_page as OtherPageT } from '@prisma/client';

import { prisma } from 'services/db';
import PageTitle from 'ui-kit/PageTitle';
import useOtherPages from 'hooks/useOtherPages';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import LoadingShadow from 'components/LoadingShadow';
import { deleteOtherPage, updateOtherPage } from 'services/other';
import styles from 'styles/AdminOther.module.scss';

import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const MarkdownPreview = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

const AdminOtherPage: NextPage<{ page: OtherPageT }> = ({ page }) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [markdown, setMarkdown] = useState<string | undefined>(
    page.markdown as string
  );
  const [title, setTitle] = useState(page.title);
  const { mutate } = useOtherPages();
  const [activePage, setActivePage] = useState(page);
  const [isEditing, setEditingStatus] = useState(false);

  const reset = () => {
    setActivePage(page);
    setEditingStatus(false);
    setTitle(activePage.title);
    setMarkdown(activePage.markdown as string);
  };

  const save = async () => {
    setIsLoading(true);
    const res = await updateOtherPage({
      id: page.id,
      markdown: markdown || '',
      title,
      slug: slug(title as string),
    });

    if (res.isOk) {
      await mutate();

      setActivePage(res.data as any);

      router.push(res.data?.slug as any);
    } else {
      console.error(res.errorMessage);
    }

    setEditingStatus(false);
    setIsLoading(false);
  };

  const edit = () => {
    setEditingStatus(true);
  };

  const handleDeleteClick = async () => {
    setIsLoading(true);
    const { isOk } = await deleteOtherPage(page.id);

    if (isOk) {
      mutate();

      router.push('/admin/other');
    }
    setIsLoading(false);
  };

  return (
    <div className={styles.pageContainer}>
      {isLoading && <LoadingShadow />}
      <PageTitle>{activePage.title}</PageTitle>
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
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <input
            disabled={!isEditing}
            className={styles.titleInput}
            type="text"
            value={title || ''}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div data-color-mode="light" className={styles.markdownWrapper}>
            {isEditing ? (
              <>
                <MDEditor value={markdown} onChange={setMarkdown} />
                <br />
                <button onClick={save} className={styles.save}>
                  Сохранить
                </button>
              </>
            ) : (
              <MarkdownPreview source={markdown} />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const page = await prisma.other_page.findUnique({
    where: {
      slug: ctx.query.slug as string,
    },
  });

  if (!page) {
    return {
      redirect: {
        permanent: false,
        destination: '/other',
      },
    };
  }

  return {
    props: {
      page,
    },
  };
};

export default AdminOtherPage;
