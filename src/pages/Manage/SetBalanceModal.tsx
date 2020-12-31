import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input, Select } from "antd"
import { v4 } from "uuid"
import { setBalance, contentsState } from "../../database/database"
import SetModal from "./SetModal"
import { latest } from "../../utils/history"

const { Option } = Select

const SetBalanceModal = ({ balanceKey }: { balanceKey?: string }) => {
  const [form] = Form.useForm<Balance>()

  const { balances, tickers, wallets } = useRecoilValue(contentsState)
  const initialValues = balanceKey
    ? latest(balances)[balanceKey]
    : { balanceKey: v4(), balance: 0 }

  const submit = async () => {
    const { balance, ...values } = await form.validateFields()
    await setBalance({ ...values, balance: Number(balance) })
    form.resetFields()
  }

  return (
    <SetModal
      type={balanceKey ? "edit" : "add"}
      form={{ form, initialValues }}
      submit={submit}
    >
      <Form.Item name="balanceKey" label="Key" rules={[{ required: true }]}>
        <Input readOnly />
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

      <Form.Item name="balance" label="잔고" rules={[{ required: true }]}>
        <Input type="number" autoFocus />
      </Form.Item>
    </SetModal>
  )
}

export default SetBalanceModal
