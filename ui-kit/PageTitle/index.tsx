import type { FC, ReactNode } from 'react';
import styles from './styles.module.scss';

interface PageTitleProps {
  children: ReactNode;
}

const PageTitle: FC<PageTitleProps> = ({ children }) => (
  <p className={styles.pageTitle}>{children}</p>
);

export default PageTitle;
