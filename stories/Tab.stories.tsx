import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Tab from '../ui-kit/Tab';

export default {
  title: 'Tab/Tab',
  component: Tab,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Tab>;

const Template: ComponentStory<typeof Tab> = (args) => {
  const data = ['Информация', 'Расписание', 'Встречи', 'Статистика']
  return <Tab data={data}/>;
}

export const Primary = Template.bind({});
Primary.args = {};

