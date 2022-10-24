import type { ComponentStory, ComponentMeta } from '@storybook/react'
import PageTitle from '../PageTitle'

export default {
    title: 'PageTitle',
    component: PageTitle
} as ComponentMeta<typeof PageTitle>;

const Template: ComponentStory<typeof PageTitle> = ({ children, ...args }) => {
  return (
    <PageTitle {...args}>{children}</PageTitle>
  )
}

export const Primary = Template.bind({});

Primary.args ={
    children: 'Header',
    size: 'sm',
    bold: true
}