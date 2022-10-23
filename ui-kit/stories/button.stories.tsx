import type { ComponentStory, ComponentMeta } from '@storybook/react'
import Button from '../Button'

export default {
  title: 'Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = ({ children, ...args }) => {
  return (
    <Button {...args}>{children}</Button>
  )
}

export const Primary = Template.bind({});

Primary.args = {
  children: 'click button',
  type: 'primary',
  disabled: true,
  isLoading: true,
  fullWidth: true,
}