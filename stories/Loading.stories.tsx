import type { ComponentStory, ComponentMeta } from '@storybook/react';

import LoadingSpinner from '../ui-kit/LoadingSpinner';

export default {
  title: 'LoadingSpinner/LoadingSpinner',
  component: LoadingSpinner,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof LoadingSpinner>;

const Template: ComponentStory<typeof LoadingSpinner> = () => {
  return <LoadingSpinner />;
};

export const Primary = Template.bind({});
Primary.args = {};
