import type { FC } from 'react';

import styles from './styles.module.scss';

interface IPageTitleProps {
  children: string;
}

const PageTitle: FC<IPageTitleProps> = ({ children }) => (
  <h1 className={styles.pageTitle}>{children}</h1>
);

export default PageTitle;
