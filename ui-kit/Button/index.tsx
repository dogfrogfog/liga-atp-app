import type { ReactNode } from 'react';

import styles from './styles.module.scss';

type ButtonProps = {
  children: ReactNode;
};

const Button = ({ children }: ButtonProps) => {
  return <button className={styles.button}>{children}</button>;
};

export default Button;
