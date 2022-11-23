import type { FC } from 'react';
import styles from './styles.module.scss';
import cl from 'classnames'

interface ITabsProps {
  data: string[];
  onClick: (v : string) => void;
  activeTabIndex: string;

}

const Tabs: FC<ITabsProps> = ({ data, activeTabIndex, onClick }: ITabsProps) => (
  <div className={styles.container}>
    {data.map(v => (<div key={v}  onClick={() =>onClick(v)} className={cl(styles.tab, activeTabIndex === v ? styles.isActive : '')}>{v}</div>))}
  </div>
)

export default Tabs