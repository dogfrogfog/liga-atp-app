import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Tabs from '../ui-kit/Tabs';
import { useState } from 'react';

export default {
  title: 'Tabs/Tabs',
  component: Tabs,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Tabs>;

const Template: ComponentStory<typeof Tabs> = (args) => {
  const data = ['Информация', 'Расписание', 'Встречи', 'Статистика'];
  const [activeTab, setActiveTab] = useState(data[0]);
  const handleChange = (v: string) => {
    setActiveTab(v);
  };
  return <Tabs tabNames={data} activeTab={activeTab} onChange={handleChange} />;
};

export const Primary = Template.bind({});
Primary.args = {};
