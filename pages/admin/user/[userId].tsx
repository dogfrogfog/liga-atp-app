import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Form, DatePicker, Radio, Input, Button, Upload, Select } from 'antd'

import styles from './UserPage.module.scss'

// todo prefetch data
const UserPage: NextPage = () => {
  const router = useRouter()
  const [{ submit }] = Form.useForm()

  const userId = router.query.userId

  const handleSubmit = () => {
    // todo
  }

  return (
    <div className={styles.userFormContainer}>
      <h1>Страница пользователя {userId}</h1>
      <Button>Сбросить</Button>
      <Button type="primary">Сохранить</Button>
      <Button danger>Удалить</Button>
      <Form
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        layout="horizontal"
        // onValuesChange={onFormLayoutChange}
      >
        <Form.Item label="Имя">
          <Input />
        </Form.Item>
        <Form.Item label="Фамилия">
          <Input />
        </Form.Item>
        <Form.Item label="Дата рождения">
          <DatePicker placeholder="Дата" />
        </Form.Item>
        <Form.Item label="Рост">
          <Input />
        </Form.Item>
        <Form.Item label="Уровень">
          <Select>
            <Select.Option value="masters">Masters</Select.Option>
            <Select.Option value="Chellenger">Chellenger</Select.Option>
            <Select.Option value="Futures">Futures</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Эло">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Страна">
          <Select>
            <Select.Option value="Belarus">Belarus</Select.Option>
            <Select.Option value="Ukraine">Ukraine</Select.Option>
            <Select.Option value="Poland">Poland</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Город">
          <Select disabled>
            <Select.Option value="Belarus">Minsk</Select.Option>
            <Select.Option value="Ukraine">Ukraine</Select.Option>
            <Select.Option value="Poland">Poland</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Основная рука">
          <Radio.Group>
            <Radio value="left">Левая</Radio>
            <Radio value="right">Правая</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="Email">
          <Input type="email" />
        </Form.Item>
        <Form.Item label="Номер телефона">
          <Input type="phone" />
        </Form.Item>
        <Form.Item label="Upload" valuePropName="fileList">
          <Upload action="/upload.do" listType="picture-card">
            <div>
              {/* <PlusOutlined /> */}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          </Upload>
        </Form.Item>
      </Form>
    </div>
  )
}

// export const get

export default UserPage
