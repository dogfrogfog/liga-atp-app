import type { FC, ReactNode } from 'react';
import styles from './styles.module.scss';

interface PageTitleProps {
  children: ReactNode;
}

const PageTitle: FC<PageTitleProps> = ({ children }) => (
  <h1 className={styles.pageTitle}>{children}</h1>
);

export default PageTitle;
