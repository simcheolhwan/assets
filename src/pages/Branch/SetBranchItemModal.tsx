import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input } from "antd"
import { isNil } from "ramda"
import { latest } from "../../utils/history"
import { contentsState, setBranchItem } from "../../database/database"
import { assetQuery } from "../../database/assets"
import SetModal from "../Manage/SetModal"

const SetBranchItemModal = ({ date }: { date: string }) => {
  const [form] = Form.useForm<Dictionary<number>>()

  const contents = useRecoilValue(contentsState)
  const { branch = {} } = contents
  const branchItem = date ? branch[date] : latest(branch)

  const asset = useRecoilValue(assetQuery)
  const getLabel = (balanceKey: string) => {
    const { ticker, wallet } = asset(balanceKey)
    return `${ticker} (${wallet})`
  }

  const submit = async () => {
    const values = await form.validateFields()
    const updates = Object.entries(values).reduce(
      (acc, [branchKey, balance]) => {
        const next = Number(balance)
        return Object.assign({}, acc, !isNil(balance) && { [branchKey]: next })
      },
      {}
    )

    await setBranchItem(updates, date)
    form.resetFields()
  }

  return (
    <SetModal type={date ? "edit" : "add"} form={{ form }} submit={submit}>
      {Object.keys(branchItem).map((key) => (
        <Form.Item name={key} label={getLabel(key)} key={key}>
          <Input type="number" />
        </Form.Item>
      ))}
    </SetModal>
  )
}

export default SetBranchItemModal
