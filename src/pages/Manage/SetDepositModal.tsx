import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input } from "antd"
import { setDeposit, contentsState } from "../../database/database"
import { today } from "../../utils/history"
import SetModal from "./SetModal"
import { update } from "ramda"

const SetDepositModal = ({ index }: { index?: number }) => {
  const [form] = Form.useForm<Deposit>()

  const { deposits } = useRecoilValue(contentsState)
  const initialValues = Number.isInteger(index)
    ? { ...deposits[index!], amount: deposits[index!].amount / 1e6 }
    : { date: today }

  const submit = async () => {
    const values = await form.validateFields()
    const item = { ...values, amount: values.amount * 1e6 }
    await setDeposit(
      Number.isInteger(index)
        ? update(index!, item, deposits)
        : [...deposits, item]
    )
  }

  return (
    <SetModal
      type={Number.isInteger(index) ? "edit" : "add"}
      form={{ form, initialValues }}
      submit={submit}
    >
      <Form.Item name="date" label="날짜" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item name="title" label="항목" rules={[{ required: true }]}>
        <Input autoFocus />
      </Form.Item>

      <Form.Item name="amount" label="내역 (백만)" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>
    </SetModal>
  )
}

export default SetDepositModal
