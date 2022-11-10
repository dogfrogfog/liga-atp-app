import type { ReactNode } from 'react'

import styles from './styles.module.scss';

interface IModalProps {
  title: string;
  children: ReactNode;
  handleClose: () => void;
}

const Modal = ({ title, children, handleClose }: IModalProps) => {
  const handleOverlayClick = (e: any) => {
    if (e.target.id === 'overlay') {
      handleClose();
    }
  };

  return (
    <div className={styles.modal}>
      <div onClick={handleOverlayClick} className={styles.overlay} id='overlay'></div>
      <div className={styles.modalBlock}>
        <div className={styles.modalHeader}>
          <p>{title}</p>
          <p className={styles.close} onClick={handleClose}>X</p>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;