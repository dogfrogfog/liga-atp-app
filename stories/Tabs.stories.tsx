import { useState } from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import TabsUI from '../ui-kit/Tabs';

export default {
  title: 'Tabs',
  component: TabsUI,
} as ComponentMeta<typeof TabsUI>;

const TAB_NAMES = ['Tab 1', 'Tab 2', 'Tab 3', 'Tab 4'];
const Template: ComponentStory<typeof TabsUI> = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(TAB_NAMES[0]);

  const handleTabChange = (_: any, v: number) => {
    setActiveTabIndex(TAB_NAMES[v]);
  };

  return (
    <TabsUI
      tabNames={TAB_NAMES}
      activeTabIndex={activeTabIndex}
      onChange={handleTabChange}
    />
  );
};

export const Tabs = Template.bind({});
Tabs.args = {};
