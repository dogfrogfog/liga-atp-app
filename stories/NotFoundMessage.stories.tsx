import type { ComponentStory, ComponentMeta } from '@storybook/react';

import NotFoundMessageUI from '../ui-kit/NotFoundMessage';

export default {
  title: 'NotFoundMessage',
  component: NotFoundMessageUI,
} as ComponentMeta<typeof NotFoundMessageUI>;

const Template: ComponentStory<typeof NotFoundMessageUI> = (args) => (
  <NotFoundMessageUI {...args} />
);

export const NotFoundMessage = Template.bind({});
NotFoundMessage.args = {};
