import type { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../ui-kit/Button';

export default {
  title: 'Button/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  children: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  children: 'secondary',
};
