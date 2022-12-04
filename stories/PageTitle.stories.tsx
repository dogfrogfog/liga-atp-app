import type { ComponentStory, ComponentMeta } from '@storybook/react';

import PageTitleUI from '../ui-kit/PageTitle';

export default {
  title: 'PageTitle',
  component: PageTitleUI,
} as ComponentMeta<typeof PageTitleUI>;

const Template: ComponentStory<typeof PageTitleUI> = (args) => {
  return (
    <div style={{ backgroundColor: 'grey' }}>
      <PageTitleUI {...args} />
    </div>
  );
};

export const PageTitle = Template.bind({});
PageTitle.args = {
  children: 'Page title',
};
