import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input } from "antd"
import { isNil } from "ramda"
import { formatAmount } from "../../utils/format"
import { latest } from "../../utils/history"
import { contentsState, setBalanceItem } from "../../database/database"
import SetModal from "./SetModal"

const SetBalanceItemModal = ({ date }: { date?: string }) => {
  const [form] = Form.useForm<Dictionary<number>>()

  const { balances, tickers, wallets } = useRecoilValue(contentsState)
  const balanceItem = date ? balances[date] : latest(balances)

  const getLabel = (balanceKey: string) => {
    const { tickerKey, walletKey, balance } = balanceItem[balanceKey]
    const ticker = tickers[tickerKey].name
    const wallet = wallets[walletKey]
    return `${formatAmount(balance)} ${ticker} (${wallet})`
  }

  const submit = async () => {
    const values = await form.validateFields()
    const updates = Object.entries(values).reduce(
      (acc, [balanceKey, balance]) => {
        const next = { ...balanceItem[balanceKey], balance: Number(balance) }
        return Object.assign({}, acc, !isNil(balance) && { [balanceKey]: next })
      },
      {}
    )

    await setBalanceItem(updates)
    form.resetFields()
  }

  return (
    <SetModal type={date ? "edit" : "add"} form={{ form }} submit={submit}>
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
