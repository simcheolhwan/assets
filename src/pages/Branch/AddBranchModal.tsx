import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input, Select } from "antd"
import { latest } from "../../utils/history"
import { setBranch, contentsState } from "../../database/database"
import SetModal from "../Manage/SetModal"

const { Option } = Select

interface Props {
  date: string
}

const AddBranchModal = ({ date }: Props) => {
  const [form] = Form.useForm<Balance>()

  const { balances, tickers, wallets } = useRecoilValue(contentsState)
  const latestBalance = latest(balances)
  const initialValues = { balance: 0 }

  const submit = async () => {
    const { balance, balanceKey } = await form.validateFields()
    const prev = latestBalance[balanceKey]
    await setBranch({ ...prev, balance: Number(balance) }, date)
    form.resetFields()
  }

  return (
    <SetModal type="add" form={{ form, initialValues }} submit={submit}>
      <Form.Item name="balanceKey" label="지갑" rules={[{ required: true }]}>
        <Select>
          {Object.entries(latestBalance).map(
            ([balanceKey, { tickerKey, walletKey }]) => (
              <Option value={balanceKey} key={balanceKey}>
                {[tickers[tickerKey].name, wallets[walletKey]].join(" ")}
              </Option>
            )
          )}
        </Select>
      </Form.Item>

      <Form.Item name="balance" label="잔고" rules={[{ required: true }]}>
        <Input type="number" autoFocus />
      </Form.Item>
    </SetModal>
  )
}

export default AddBranchModal
