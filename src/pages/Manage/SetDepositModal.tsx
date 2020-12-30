import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input } from "antd"
import { update } from "ramda"
import { setDeposit, contentsState } from "../../database/database"
import { todayQuery } from "../../database/date"
import SetModal from "./SetModal"

const SetDepositModal = ({ index }: { index?: number }) => {
  const today = useRecoilValue(todayQuery)
  const [form] = Form.useForm<Deposit>()

  const { deposits } = useRecoilValue(contentsState)
  const deposit = index ? deposits[index!] : undefined
  const initialValues = Number.isInteger(index)
    ? { ...deposit, amount: deposit?.amount && deposit.amount / 1e6 }
    : { date: today }

  const submit = async () => {
    const { amount, ...values } = await form.validateFields()
    const item: Deposit = Object.assign(
      {},
      values,
      amount && { amount: Number(amount) * 1e6 }
    )

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

      <Form.Item name="amount" label="내역 (백만)">
        <Input type="number" />
      </Form.Item>
    </SetModal>
  )
}

export default SetDepositModal
