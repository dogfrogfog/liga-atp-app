import type { FC, ReactNode } from 'react'
import styles from './styles.module.css'

interface ButtonProps {
  type: 'primary' | 'secondary' | 'shadow',
  disabled: true | false,
  isLoading: true | false,
  fullWidth: true | false
  children: ReactNode
}

const Button: FC<ButtonProps> = ({ type, disabled, isLoading, fullWidth, children }: ButtonProps) => {
    <button className={styles.Button}>{children}</button>
}

export default Button