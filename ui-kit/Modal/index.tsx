import type { FC, ReactNode, Dispatch, SetStateAction } from 'react'
import styles from './styles.module.scss';

interface IModalProps {
  title: string;
  children: ReactNode;
  setModalOpenStatus: Dispatch<SetStateAction<boolean>>;
}


const Modal: FC<IModalProps> = ({ title, children, setModalOpenStatus }) => {
  const handleModalClose = () => {
    setModalOpenStatus(false)
  }

  const handleOverlayClick = (e: any) => {
    if (e.target.id === 'overlay') {
      handleModalClose()
    }
  }

  return (
    <div className={styles.modal}>
      <div onClick={handleOverlayClick} className={styles.overlay} id='overlay'></div>
      <div className={styles.modalBlock}>
        <div className={styles.modalHeader}>
          <p>{title}</p>
          <p className={styles.close} onClick={handleModalClose}>X</p>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal