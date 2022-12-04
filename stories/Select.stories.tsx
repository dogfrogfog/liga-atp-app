import { useState, ChangeEvent } from 'react';
import type { ComponentStory, ComponentMeta } from '@storybook/react';

import SelectUI from '../ui-kit/Select';

export default {
  title: 'Select',
  component: SelectUI,
} as ComponentMeta<typeof SelectUI>;

const Template: ComponentStory<typeof SelectUI> = (args) => {
  const [value, setValue] = useState<number | string>('');

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  return (
    <div
      style={{ backgroundColor: 'grey', margin: '50px 150px', color: 'white' }}
    >
      <SelectUI
        {...args}
        value={value}
        handleSelectChange={handleSelectChange}
      />
    </div>
  );
};

export const Select = Template.bind({});
Select.args = {
  name: 'select-name',
  options: [[0, 'one'], [1, 'two' ]]
};
