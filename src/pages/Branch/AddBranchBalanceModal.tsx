import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input, Select } from "antd"
import { setBranch, contentsState } from "../../database/database"
import SetModal from "../Manage/SetModal"

const { Option } = Select

interface Props {
  date: string
}

const AddBranchBalanceModal = ({ date }: Props) => {
  const [form] = Form.useForm<{ balanceKey: string; balance: string }>()

  const { tickers, wallets, assets } = useRecoilValue(contentsState)
  const initialValues = { balance: 0 }

  const submit = async () => {
    const { balance, balanceKey } = await form.validateFields()
    await setBranch(balanceKey, Number(balance), date)
    form.resetFields()
  }

  return (
    <SetModal type="add" form={{ form, initialValues }} submit={submit}>
      <Form.Item name="balanceKey" label="지갑" rules={[{ required: true }]}>
        <Select>
          {Object.entries(assets).map(
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

export default AddBranchBalanceModal
