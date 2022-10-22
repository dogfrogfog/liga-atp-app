import Button from './button'
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const ButtonStory = Template.bind({});

ButtonStory.args = {
  type: 'primary',
  disabled: false,
  isLoading: false,
  fullWidth: true
}