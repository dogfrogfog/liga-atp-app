import type { ReactNode } from 'react';
import cl from 'classnames';
import { BiArrowBack } from 'react-icons/bi';

import styles from './styles.module.scss';

interface IButtonProps {
  children?: ReactNode;
  type: 'primary' | 'ghost' | 'circle';
  onClick?: () => void;
}

const Button = ({ children, type, onClick }: IButtonProps) => {
  return (
    <button onClick={onClick} className={cl(styles.button, styles[type])}>
      {type === 'circle' ? <BiArrowBack size="xl" /> : children}
    </button>
  );
};

export default Button;
