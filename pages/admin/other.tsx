import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { ChangeEvent, useState } from 'react';
import type { other_pages as OtherPage } from '@prisma/client';
import axios from 'axios';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false, loading: () => <LoadingSpinner /> }
);

import { prisma } from 'services/db';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import { OTHER_PAGES_KEYS } from 'constants/values';
import PageTitle from 'ui-kit/PageTitle';
import styles from 'styles/AdminOther.module.scss';

const updateOtherPage = async (
  data: Omit<OtherPage, 'id'>
): Promise<{ isOk: boolean; errorMessage?: string; data?: OtherPage }> => {
  const response = await axios.put<OtherPage>('/api/otherPages', { data });

  if (response.status === 200) {
    return { isOk: true, data: response.data };
  } else {
    return { isOk: false, errorMessage: response.statusText };
  }
};

const AdminOtherPage: NextPage<{ pages: OtherPage[] }> = ({ pages }) => {
  const [activePage, setActivePage] = useState<OtherPage | undefined>();
  const [isSaved, setIsSaved] = useState(false);

  const handlePageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newPage = pages.find(
      (p) => p.page_name === e.target.value
    ) as OtherPage;

    setActivePage(newPage);
  };

  const handleMarkdownChange = (markdownValue?: string) => {
    // @ts-ignore
    setActivePage((v) => ({
      ...v,
      content: markdownValue,
    }));
  };

  const save = async () => {
    if (activePage) {
      const res = await updateOtherPage(activePage);

      if (res.isOk) {
        setActivePage(res.data);
        setIsSaved(true);

        setTimeout(() => {
          setIsSaved(false);
        }, 2000);
      } else {
        console.error(res.errorMessage);
      }
    }
  };

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Страницы раздела прочее</PageTitle>
      <select
        className={styles.select}
        onChange={handlePageChange}
        value={activePage?.page_name || ''}
      >
        <option value="">Выбирите страницу для редактирования</option>
        <option value={OTHER_PAGES_KEYS.schedule}>Расписание</option>
        <option value={OTHER_PAGES_KEYS.events}>Мероприятия</option>
        <option value={OTHER_PAGES_KEYS.fame}>Аллея славы</option>
      </select>
      <br />
      {activePage && (
        <>
          <div data-color-mode="light" className={styles.markdownWrapper}>
            <MDEditor
              value={activePage.content || ''}
              onChange={handleMarkdownChange}
            />
          </div>
          <button className={styles.submitButton} onClick={save}>
            Сохранить
          </button>
        </>
      )}
      {isSaved && (
        <div className={styles.savedIndicator}>Страница сохранена</div>
      )}
    </div>
  );
};

export const getServerSideProps = async () => {
  const otherPagesRecords = await prisma.other_pages.findMany();

  return {
    props: {
      pages: otherPagesRecords || [],
    },
  };
};

export default AdminOtherPage;
