import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input } from "antd"
import { latest } from "../../utils/history"
import { setBalance, contentsState } from "../../database/database"
import SetModal from "./SetModal"

const SetBalanceModal = ({ balanceKey }: { balanceKey: string }) => {
  const [form] = Form.useForm<{ balance: number }>()

  const { balances } = useRecoilValue(contentsState)
  const initialValues = { balance: latest(balances)[balanceKey] }

  const submit = async () => {
    const { balance } = await form.validateFields()
    await setBalance(balanceKey, Number(balance))
    form.resetFields()
  }

  return (
    <SetModal
      type={balanceKey ? "edit" : "add"}
      form={{ form, initialValues }}
      submit={submit}
    >
      <Form.Item name="balance" label="잔고" rules={[{ required: true }]}>
        <Input type="number" autoFocus />
      </Form.Item>
    </SetModal>
  )
}

export default SetBalanceModal
