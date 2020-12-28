import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input } from "antd"
import { isNil } from "ramda"
import { formatAmount } from "../../utils/format"
import { latest } from "../../utils/history"
import { contentsState, setBranchItem } from "../../database/database"
import SetModal from "../Manage/SetModal"

const SetBranchItemModal = ({ date }: { date: string }) => {
  const [form] = Form.useForm<Dictionary<number>>()

  const { branch = {}, tickers, wallets } = useRecoilValue(contentsState)
  const branchItem = date ? branch[date] : latest(branch)

  const getLabel = (branchKey: string) => {
    const { tickerKey, walletKey, balance } = branchItem[branchKey]
    const ticker = tickers[tickerKey].name
    const wallet = wallets[walletKey]
    return `${formatAmount(balance)} ${ticker} (${wallet})`
  }

  const submit = async () => {
    const values = await form.validateFields()
    const updates = Object.entries(values).reduce(
      (acc, [branchKey, balance]) => {
        const next = { ...branchItem[branchKey], balance: Number(balance) }
        return Object.assign({}, acc, !isNil(balance) && { [branchKey]: next })
      },
      {}
    )

    await setBranchItem(updates, date)
    form.resetFields()
  }

  return (
    <SetModal type={date ? "edit" : "add"} form={{ form }} submit={submit}>
      {Object.keys(branchItem).map((branchKey) => (
        <Form.Item name={branchKey} label={getLabel(branchKey)} key={branchKey}>
          <Input type="number" />
        </Form.Item>
      ))}
    </SetModal>
  )
}

export default SetBranchItemModal
