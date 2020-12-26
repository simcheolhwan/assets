import React from "react"
import { v4 } from "uuid"
import { Button, Modal, Form, Input, Radio } from "antd"
import { useModal } from "../../hooks"
import { addTicker } from "../../database/database"

const AddTickerModal = () => {
  const { isOpen, open, close } = useModal()
  const [form] = Form.useForm()

  const onAdd = async () => {
    const values = await form.validateFields()
    await addTicker({ ...values, tickerKey: v4() })
    close()
  }

  return (
    <>
      <Button type="default" onClick={open}>
        추가하기
      </Button>

      <Modal title="추가하기" visible={isOpen} onOk={onAdd} onCancel={close}>
        <Form form={form} layout="vertical" initialValues={{ currency: "KRW" }}>
          <Form.Item name="name" label="이름" rules={[{ required: true }]}>
            <Input autoFocus />
          </Form.Item>

          <Form.Item name="currency">
            <Radio.Group>
              <Radio value="KRW">KRW</Radio>
              <Radio value="USD">USD</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddTickerModal
