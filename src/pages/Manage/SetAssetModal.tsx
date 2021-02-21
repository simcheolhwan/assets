import React from "react"
import { useRecoilValue } from "recoil"
import { Checkbox, Form, Input, Select } from "antd"
import { pickBy } from "ramda"
import { v4 } from "uuid"
import { setAsset, contentsState } from "../../database/database"
import SetModal from "./SetModal"

const { Option } = Select

const SetAssetModal = ({ balanceKey }: { balanceKey?: string }) => {
  const [form] = Form.useForm<Asset>()

  const { tickers, wallets, assets } = useRecoilValue(contentsState)
  const initialValues = balanceKey ? assets[balanceKey] : { balanceKey: v4() }

  const submit = async () => {
    const asset = await form.validateFields()
    await setAsset(pickBy((value) => value, asset))
    form.resetFields()
  }

  return (
    <SetModal
      type={balanceKey ? "edit" : "add"}
      form={{ form, initialValues }}
      submit={submit}
    >
      <Form.Item name="balanceKey" label="Key" rules={[{ required: true }]}>
        <Input readOnly />
      </Form.Item>

      <Form.Item name="tickerKey" label="종목" rules={[{ required: true }]}>
        <Select>
          {Object.values(tickers).map(({ tickerKey, name }) => (
            <Option value={tickerKey} key={tickerKey}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item name="walletKey" label="지갑" rules={[{ required: true }]}>
        <Select>
          {Object.entries(wallets).map(([walletKey, name]) => (
            <Option value={walletKey} key={walletKey}>
              {name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="hidden"
        valuePropName="checked"
        wrapperCol={{ offset: 6 }}
      >
        <Checkbox>숨김</Checkbox>
      </Form.Item>
    </SetModal>
  )
}

export default SetAssetModal
