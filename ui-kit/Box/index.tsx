import type { FC, ReactNode } from 'react';
import cl from 'classnames';

import styles from './styles.module.scss';

interface IBoxProps {
  children: ReactNode;
  className: string;
}

const Box: FC<IBoxProps> = ({ children, className }) => (
  <div className={cl(styles.box, className)}>{children}</div>
);

export default Box;
