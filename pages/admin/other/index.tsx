import type { NextPage } from 'next';
import Link from 'next/link';
import { DragEvent, useEffect, useState } from 'react';

import PageTitle from 'ui-kit/PageTitle';
import useOtherPages from 'hooks/useOtherPages';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import styles from 'styles/AdminOther.module.scss';
import { other_page } from '@prisma/client';
import { updateOrderOtherPages } from 'services/other';

const AdminOtherPage: NextPage = () => {
  const { otherPages, isLoading } = useOtherPages();
  const [pages, setPages] = useState<other_page[]>([]);
  const [currentPage, setCurrentPage] = useState<other_page | null>(null);

  const dragStartHandler = (elem: other_page) => {
    setCurrentPage(elem);
  };

  const dragEndHandler = (e: DragEvent<HTMLAnchorElement>) => {
    (e.target as HTMLAnchorElement).style.backgroundColor = '#dbdbdb';
  };

  const dragOverHandler = (e: DragEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    (e.target as HTMLAnchorElement).style.backgroundColor = 'red';
  };

  const dropHandler = (e: DragEvent<HTMLAnchorElement>, elem: other_page) => {
    e.preventDefault();

    if (!currentPage) {
      return;
    }

    (e.target as HTMLAnchorElement).style.backgroundColor = '#dbdbdb';
    setPages(pages.map((page): other_page => {
      if (page.id === elem.id) {
        return {...page, order: currentPage.order};
      }
      if (page.id === currentPage?.id) {
        return {...page, order: elem.order};
      }
      return page;
    }));
    setCurrentPage(null);
  };

  const handleSaveOrderClick = async () => {
    await updateOrderOtherPages(pages);
  };

  useEffect(() => {
    setPages(otherPages);
  }, [otherPages]);

  return (
    <div className={styles.pageContainer}>
      <PageTitle>Страницы раздела прочее</PageTitle>
      <Link href="/admin/other/new">
        <a className={styles.createPageButton}>создать страницу</a>
      </Link>
      <button className={styles.createPageButton} onClick={handleSaveOrderClick}>сохранить порядок</button>
      <br />
      <br />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        pages.sort((a, b) => a.order - b.order).map((elem) => (
          <Link key={elem.slug} href={`/admin/other/${elem.slug}`}>
            <a
              className={styles.pageLink}
              draggable
              onDragStart={() => dragStartHandler(elem)}
              onDragLeave={(e) => dragEndHandler(e)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => dropHandler(e, elem)}
            >
              {elem.title}
            </a>
          </Link>
        ))
      )}
    </div>
  );
};

export default AdminOtherPage;
