import type { ComponentStory, ComponentMeta } from '@storybook/react';

import SuggestionsInput from '../ui-kit/SuggestionsInput';

export default {
  title: 'SuggestionsInput/SuggestionsInput',
  component: SuggestionsInput,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof SuggestionsInput>;

const Template: ComponentStory<typeof SuggestionsInput> = (args) => (
  <SuggestionsInput {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  placeholder: 'Placeholder',
};

export const Secondary = Template.bind({});
Secondary.args = {
  placeholder: 'Placeholder',
};
