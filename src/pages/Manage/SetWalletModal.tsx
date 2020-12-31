import React from "react"
import { useRecoilValue } from "recoil"
import { v4 } from "uuid"
import { Form, Input } from "antd"
import { contentsState, setWallet } from "../../database/database"
import SetModal from "./SetModal"

const SetWalletModal = ({ walletKey }: { walletKey?: string }) => {
  const [form] = Form.useForm<{ walletKey: string; name: string }>()

  const { wallets } = useRecoilValue(contentsState)
  const initialValues = walletKey
    ? { walletKey, name: wallets[walletKey] }
    : { walletKey: v4() }

  const submit = async () => {
    const values = await form.validateFields()
    await setWallet(values.walletKey, values.name)
    form.resetFields()
  }

  return (
    <SetModal
      type={walletKey ? "edit" : "add"}
      form={{ form, initialValues }}
      submit={submit}
    >
      <Form.Item name="walletKey" label="Key" rules={[{ required: true }]}>
        <Input readOnly />
      </Form.Item>

      <Form.Item name="name" label="이름" rules={[{ required: true }]}>
        <Input autoFocus />
      </Form.Item>
    </SetModal>
  )
}

export default SetWalletModal
