import type { FC, ReactNode } from 'react';
import cl from 'classnames';
import styles from './styles.module.scss';

interface PageTitleProps {
  children: ReactNode;
  className?: string;
}

const PageTitle: FC<PageTitleProps> = ({ children, className }) => (
  <p className={cl(styles.pageTitle, className)}>{children}</p>
);

export default PageTitle;
