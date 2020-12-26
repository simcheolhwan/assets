import React from "react"
import { v4 } from "uuid"
import { Button, Modal, Form, Input, Select } from "antd"
import { useModal } from "../../hooks"
import { addBalance, contentsState } from "../../database/database"
import { useRecoilValue } from "recoil"

const { Option } = Select

const AddBalanceModal = () => {
  const { tickers, wallets } = useRecoilValue(contentsState)
  const { isOpen, open, close } = useModal()
  const [form] = Form.useForm()

  const onAdd = async () => {
    const values = await form.validateFields()
    await addBalance({ balanceKey: v4(), ...values })
    close()
  }

  return (
    <>
      <Button type="default" onClick={open}>
        추가하기
      </Button>

      <Modal title="추가하기" visible={isOpen} onOk={onAdd} onCancel={close}>
        <Form form={form} layout="vertical" initialValues={{ balance: 0 }}>
          <Form.Item name="balance" label="잔고" rules={[{ required: true }]}>
            <Input type="number" autoFocus />
          </Form.Item>

          <Form.Item name="tickerKey" label="종목" rules={[{ required: true }]}>
            <Select>
              {Object.values(tickers).map(({ tickerKey, name }) => (
                <Option value={tickerKey} key={tickerKey}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="walletKey" label="지갑" rules={[{ required: true }]}>
            <Select>
              {Object.entries(wallets).map(([walletKey, name]) => (
                <Option value={walletKey} key={walletKey}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddBalanceModal
