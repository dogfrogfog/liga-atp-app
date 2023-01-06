import cl from 'classnames';

import styles from './styles.module.scss';

interface INotFoundMessageProps {
  message: string;
  className?: string;
}

const NotFoundMessage = ({ message, className }: INotFoundMessageProps) => {
  return (
    <div className={cl(styles.notFoundMessage, className)}>
      <p>{message}</p>
    </div>
  );
};

export default NotFoundMessage;
