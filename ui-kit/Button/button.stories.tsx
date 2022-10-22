import {Button} from './button'

export default {
    title: 'Button',
    component: Button,
};

const Template = (args) => <Button {...args} />;

export const FirstStory = {
  args: {
    //👇 The args you need here will depend on your component
  },
  <Button></Button>
};