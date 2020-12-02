import { Form, Input, Button } from "antd"

interface Props {
  onSignIn: (values: { password: string }) => Promise<void>
}

const layout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }
const tailLayout = { wrapperCol: { offset: 8, span: 16 } }

const SignIn = ({ onSignIn }: Props) => {
  return (
    <Form {...layout} onFinish={onSignIn}>
      <Form.Item label="비밀번호" name="password" rules={[{ required: true }]}>
        <Input.Password autoFocus />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          로그인
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SignIn
