import styles from './styles.module.scss';

interface INotFoundMessageProps {
  message: string;
}

const NotFoundMessage = ({ message }: INotFoundMessageProps) => {
  return <div className={styles.notFoundMessage}>{message}</div>;
};

export default NotFoundMessage;
