import type { FC, ReactNode } from 'react'
import styles from './styles.module.css'

interface ButtonProps {
  type?: 'primary' | 'secondary' | 'shadow',
  disabled?: true | false,
  isLoading?: true | false,
  fullWidth?: true | false
  children: ReactNode
}

const Button: FC<ButtonProps> = ({
  type = 'primary',
  children,
  disabled = false,
  isLoading = false,
  fullWidth = false,
}: ButtonProps) => {
  return (
    <button className={styles.Button}>{children}</button>
  )
}

export default Button