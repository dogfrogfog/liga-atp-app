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
  players: [
    // @ts-ignore
    {
      first_name: 'John',
      last_name: 'Lennon',
    },
    // @ts-ignore
    {
      first_name: 'Max',
      last_name: 'Lemon',
    },
    // @ts-ignore
    {
      first_name: 'John',
      last_name: 'Lenn22on',
    },
  ],
};
