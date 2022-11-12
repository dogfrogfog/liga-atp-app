import type { ReactNode } from 'react';

import styles from './styles.module.scss';

interface IButtonProps {
  children: ReactNode;
}

const Button = ({ children }: IButtonProps) => {
  return (
    <button className={styles.button}>
      {children}
    </button>
  );
}

export default Button;