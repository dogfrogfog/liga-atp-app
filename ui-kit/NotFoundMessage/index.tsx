import type { FC } from 'react';

import styles from './styles.module.scss';

interface INotFoundMessageProps {
  message: string;
}

const NotFoundMessage: FC<INotFoundMessageProps> = ({ message }) => {
  return <div className={styles.notFoundMessage}>{message}</div>;
};

export default NotFoundMessage;
