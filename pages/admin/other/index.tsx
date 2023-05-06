import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import PageTitle from 'ui-kit/PageTitle';
import useOtherPages from 'hooks/useOtherPages';
import LoadingSpinner from 'ui-kit/LoadingSpinner';
import styles from 'styles/AdminOther.module.scss';

const AdminOtherPage: NextPage = () => {
  const { otherPages, isLoading } = useOtherPages();
  /* const isLoading = false; */
  const [pages, setPages] = useState<any>([
   /*  {id: 1, order: 1, title: 'Страница 1'},
    {id: 2, order: 2, title: 'Страница 2'},
    {id: 3, order: 3, title: 'Страница 3'},
    {id: 4, order: 4, title: 'Страница 4'}, */
  ]);
  const [currentPage, setCurrentPage] = useState<any>(null);
  /* console.log(otherPages); */

  /* const pages: any =  [
    {id: 1, order: 1, title: 'Страница 1'},
    {id: 2, order: 2, title: 'Страница 2'},
    {id: 3, order: 3, title: 'Страница 3'},
    {id: 4, order: 4, title: 'Страница 4'},
  ] */

  const dragStartHandler = (e: any, elem: any) => {
    console.log('drag', elem);
    setCurrentPage(elem);
  };

  const dragEndHandler = (e: any) => {
    e.target.style.backgroundColor = '#dbdbdb';
  };

  const dragOverHandler = (e: any) => {
    e.preventDefault();
    e.target.style.backgroundColor = 'red';
  };

  const dropHandler = (e: any, elem: any) => {
    e.preventDefault();
    console.log('drop', elem);
    setPages(pages.map((page: any ) => {
      if (page.id === elem.id) {
        return {...page, order: currentPage.order};
      }
      if (page.id === currentPage.id) {
        return {...page, order: elem.order};
      }
      return page;
    }));
  };

  /* const sortPages = (a, b) => {
    
  } */
 
  useEffect(() => {
    setPages(otherPages);
  }, [otherPages]);

  /* console.log(pages); */
  
  
  return (
    <div className={styles.pageContainer}>
      <PageTitle>Страницы раздела прочее</PageTitle>
      <Link href="/admin/other/new">
        <a className={styles.createPageButton}>создать страницу</a>
      </Link>
      <br />
      <br />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        pages/* .sort((a: any, b: any) => a.order - b.order) */.map((elem: any) => (
          <Link key={elem.id} href={`/admin/other/${elem.slug}`}>
            <a
              className={styles.pageLink}
              draggable
              onDragStart={(e) => dragStartHandler(e, elem)}
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
