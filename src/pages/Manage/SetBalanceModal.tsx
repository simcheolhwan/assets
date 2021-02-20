import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input, Select } from "antd"
import { latest } from "../../utils/history"
import { setBalance, contentsState } from "../../database/database"
import { assetQuery } from "../../database/assets"
import SetModal from "./SetModal"

const { Option } = Select

const SetBalanceModal = ({ balanceKey }: { balanceKey?: string }) => {
  const [form] = Form.useForm<{ balanceKey: string; balance: number }>()

  const { balances, assets } = useRecoilValue(contentsState)
  const balanceItem = latest(balances)
  const asset = useRecoilValue(assetQuery)

  const initialValues = balanceKey
    ? { balanceKey, balance: balanceItem[balanceKey] }
    : {}

  const submit = async () => {
    const { balanceKey, balance } = await form.validateFields()
    await setBalance(balanceKey, Number(balance))
    form.resetFields()
  }

  return (
    <SetModal
      type={balanceKey ? "edit" : "add"}
      form={{ form, initialValues }}
      submit={submit}
    >
      <Form.Item
        name="balanceKey"
        label="종목"
        rules={[{ required: true }]}
        hidden={!!balanceKey}
      >
        <Select>
          {Object.keys(assets)
            .filter((key) => balanceKey || !balanceItem[key])
            .map((balanceKey) => {
              const { ticker, wallet } = asset(balanceKey)

              return (
                <Option value={balanceKey} key={balanceKey}>
                  {ticker} ({wallet})
                </Option>
              )
            })}
        </Select>
      </Form.Item>

      <Form.Item name="balance" label="잔고" rules={[{ required: true }]}>
        <Input type="number" autoFocus />
      </Form.Item>
    </SetModal>
  )
}

export default SetBalanceModal
