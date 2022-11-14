import React from 'react';
import styles from './errorMessage.module.scss'
type ErrorMessageType = {
  errorMessage: string
}
const ErrorMessage = ({errorMessage}: ErrorMessageType) => {
  return (
    <p className={styles.errorMessage}>
      {errorMessage}
    </p>
  );
};

export default ErrorMessage;