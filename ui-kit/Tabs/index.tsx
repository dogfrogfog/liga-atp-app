import type { FC } from 'react';
import cl from 'classnames';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './styles.module.scss';

type TabsProps = {
  tabNames: string[];
  onChange: (_: unknown, value: number) => void;
  activeTabIndex: string;
}

const TabsMUI: FC<TabsProps> = ({
  tabNames,
  activeTabIndex,
  onChange,
}: TabsProps) => (
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
