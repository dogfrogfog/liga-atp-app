import type { FC } from 'react';
import styles from './styles.module.scss';
import cl from 'classnames';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

interface ITabsProps {
  tabNames: string[];
  onChange: (_: any, value: number) => void;
  activeTabIndex: string;
}

const TabsMUI: FC<ITabsProps> = ({
  tabNames,
  activeTabIndex,
  onChange,
}: ITabsProps) => (
  <Tabs
    className={styles.container}
    value={tabNames.indexOf(activeTabIndex)}
    onChange={onChange}
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{ children: null }}
  >
    {tabNames.map((v) => (
      <Tab
        key={v}
        label={v}
        className={cl(styles.tab, activeTabIndex === v ? styles.activeTab : '')}
      />
    ))}
  </Tabs>
);

export default TabsMUI;
