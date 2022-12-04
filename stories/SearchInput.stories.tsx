import type { ComponentStory, ComponentMeta } from '@storybook/react';

import SearchInputUI from '../ui-kit/SearchInput';

export default {
  title: 'SearchInput',
  component: SearchInputUI,
} as ComponentMeta<typeof SearchInputUI>;

const Template: ComponentStory<typeof SearchInputUI> = (args) => {
  return (
    <div style={{ backgroundColor: 'grey' }}>
      <SearchInputUI {...args} />
    </div>
  );
};

export const SearchInput = Template.bind({});
SearchInput.args = {};
