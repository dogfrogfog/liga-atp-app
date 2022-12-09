import type { ComponentStory, ComponentMeta } from '@storybook/react';

import NotFoundMessage from '../ui-kit/NotFoundMessage';

export default {
  title: 'NotFoundMessage/NotFoundMessage',
  component: NotFoundMessage,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof NotFoundMessage>;

const Template: ComponentStory<typeof NotFoundMessage> = (args) => {
  const message =
    'Введите поисковой запрос в строку поиска или воспользуйтесь категориями из Фильтра';
  return <NotFoundMessage message={message} />;
};

export const Primary = Template.bind({});
Primary.args = {};
