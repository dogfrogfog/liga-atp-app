import type { FC } from 'react';
import cl from 'classnames';
import TabsMUI from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import styles from './styles.module.scss';

type TabsProps = {
  tabNames: string[];
  onChange: (_: any, value: number) => void;
  activeTab: string;
};

const Tabs: FC<TabsProps> = ({ tabNames, activeTab, onChange }: TabsProps) => (
  <TabsMUI
    className={styles.container}
    value={tabNames.indexOf(activeTab)}
    onChange={onChange}
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{ children: null }}
  >
    {tabNames.map((v) => (
      <Tab
        key={v}
        label={v}
        className={cl(styles.tab, activeTab === v ? styles.activeTab : '')}
      />
    ))}
  </TabsMUI>
);

export default Tabs;
