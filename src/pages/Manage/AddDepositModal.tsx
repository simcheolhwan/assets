import React from "react"
import { useRecoilValue } from "recoil"
import { Button, Modal, Form, Input } from "antd"
import { useModal } from "../../hooks"
import { addDeposit, contentsState } from "../../database/database"
import { today } from "../../utils/history"

const AddDepositModal = () => {
  const { isOpen, open, close } = useModal()
  const [form] = Form.useForm()

  const { deposits } = useRecoilValue(contentsState)
  const onAdd = async () => {
    const values = await form.validateFields()
    await addDeposit([...deposits, { ...values, amount: values.amount * 1e6 }])
    close()
  }

  return (
    <>
      <Button type="default" onClick={open}>
        추가하기
      </Button>

      <Modal title="추가하기" visible={isOpen} onOk={onAdd} onCancel={close}>
        <Form form={form} layout="vertical" initialValues={{ date: today }}>
          <Form.Item name="date" label="날짜" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="title" label="항목" rules={[{ required: true }]}>
            <Input autoFocus />
          </Form.Item>

          <Form.Item
            name="amount"
            label="내역 (백만)"
            rules={[{ required: true }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddDepositModal
