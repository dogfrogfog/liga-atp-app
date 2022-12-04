import type { ComponentStory, ComponentMeta } from '@storybook/react';

import BoxUI from '../ui-kit/Box';

export default {
  title: 'Box',
  component: BoxUI,
} as ComponentMeta<typeof BoxUI>;

const Template: ComponentStory<typeof BoxUI> = (args) => {
  return (
    <div
      style={{ backgroundColor: 'grey', margin: '50px 150px', color: 'white' }}
    >
      <BoxUI {...args} />
    </div>
  );
};

export const Box = Template.bind({});
Box.args = {
  children: (
    <div>
      <p>text</p>
      <p>text</p>
      <br />
      <p>block</p>
      <p>block</p>
    </div>
  ),
};
