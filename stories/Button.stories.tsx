import type { ComponentStory, ComponentMeta } from '@storybook/react';

import ButtonUI from '../ui-kit/Button';

export default {
  title: 'Button',
  component: ButtonUI,
} as ComponentMeta<typeof ButtonUI>;

const Template: ComponentStory<typeof ButtonUI> = (args) => {
  return (
    <div style={{ backgroundColor: 'grey' }}>
      <ButtonUI {...args} />
    </div>
  );
};

export const Button = Template.bind({});
Button.args = {
  children: 'primary',
  type: 'primary',
};
