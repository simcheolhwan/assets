import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input } from "antd"
import { isNil } from "ramda"
import { formatAmount } from "../../utils/format"
import { latest } from "../../utils/history"
import { contentsState, setBalanceItem } from "../../database/database"
import { assetQuery } from "../../database/assets"
import SetModal from "./SetModal"

const SetBalanceItemModal = ({ date }: { date?: string }) => {
  const [form] = Form.useForm<Dictionary<number>>()

  const { balances } = useRecoilValue(contentsState)
  const balanceItem = date ? balances[date] : latest(balances)
  const asset = useRecoilValue(assetQuery)

  const initialValues = Object.entries(balanceItem).reduce(
    (acc, [balanceKey, balance]) => ({ ...acc, [balanceKey]: balance }),
    {}
  )

  const getLabel = (balanceKey: string) => {
    const { ticker, wallet } = asset(balanceKey)
    return `${ticker} (${wallet})`
  }

  const submit = async () => {
    const values = await form.validateFields()
    const updates = Object.entries(values).reduce(
      (acc, [balanceKey, balance]) => {
        const next = Number(balance)
        return Object.assign({}, acc, !isNil(balance) && { [balanceKey]: next })
      },
      {}
    )

    await setBalanceItem(updates)
    form.resetFields()
  }

  return (
    <SetModal
      type={date ? "edit" : "add"}
      form={{ form, initialValues }}
      submit={submit}
    >
      {Object.keys(balanceItem).map((balanceKey) => (
        <Form.Item
          name={balanceKey}
          label={getLabel(balanceKey)}
          key={balanceKey}
        >
          <Input type="number" />
        </Form.Item>
      ))}
    </SetModal>
  )
}

export default SetBalanceItemModal
