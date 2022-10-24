import type { FC, ReactNode } from 'react'
import styles from './styles.module.css';

interface PageTitleProps {
  children: ReactNode,
  size?: 'sm' | 'md' | 'lg',
  bold?: true | false
}

const PageTitle: FC<PageTitleProps> = ({ children }) => (
  <h1 className={styles.pageTitle}> 
    {children}
  </h1>
)

export default PageTitle