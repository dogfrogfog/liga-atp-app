import type { FC } from 'react';
import styles from './styles.module.scss';

interface ITabProps {
  data: string[];
}

const Tab: FC<ITabProps> = ({ data }: ITabProps) => (
  <div className={styles.container}>
    {data.map(v => (<div key={v} className={styles.tab}>{v}</div>))}
  </div>
)

export default Tab