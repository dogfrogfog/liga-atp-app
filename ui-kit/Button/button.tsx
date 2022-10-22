import styles from './styles.module.css'

interface ButtonProps {
  type: 'primary' | 'secondary' | 'shadow',
  disabled: true | false,
  isLoading: true | false,
  fullWidth: true | false
}

const Button = ({ type , disabled, isLoading, fullWidth }: ButtonProps) => {
    <button className={styles.Button} ></button>
}

export default Button