import React from "react"
import { v4 } from "uuid"
import { Button, Modal, Form, Input } from "antd"
import { useModal } from "../../hooks"
import { addWallet } from "../../database/database"

const AddWalletModal = () => {
  const { isOpen, open, close } = useModal()
  const [form] = Form.useForm()

  const onAdd = async () => {
    const values = await form.validateFields()
    await addWallet(v4(), values.name)
    close()
  }

  return (
    <>
      <Button type="default" onClick={open}>
        추가하기
      </Button>

      <Modal title="추가하기" visible={isOpen} onOk={onAdd} onCancel={close}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="이름" rules={[{ required: true }]}>
            <Input autoFocus />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddWalletModal
