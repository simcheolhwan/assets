import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Input, Radio } from "antd"
import { pickBy } from "ramda"
import { v4 } from "uuid"
import { setTicker, contentsState } from "../../database/database"
import SetModal from "./SetModal"

const SetTickerModal = ({ tickerKey }: { tickerKey?: string }) => {
  const [form] = Form.useForm<Ticker>()

  const { tickers } = useRecoilValue(contentsState)
  const initialValues = tickerKey
    ? tickers[tickerKey]
    : { tickerKey: tickerKey ?? v4(), currency: "KRW" }

  const submit = async () => {
    const { aim, ...values } = await form.validateFields()
    await setTicker(pickBy((value) => value, { ...values, aim: Number(aim) }))
  }

  return (
    <SetModal
      type={tickerKey ? "edit" : "add"}
      form={{ form, initialValues }}
      submit={submit}
    >
      <Form.Item name="tickerKey" label="Key" rules={[{ required: true }]}>
        <Input readOnly />
      </Form.Item>

      <Form.Item name="name" label="이름" rules={[{ required: true }]}>
        <Input autoFocus />
      </Form.Item>

      <Form.Item name="currency" label="통화">
        <Radio.Group>
          <Radio value="KRW">KRW</Radio>
          <Radio value="USD">USD</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="icon" label="아이콘">
        <Input />
      </Form.Item>

      <Form.Item name="aim" label="목표 비율">
        <Input type="number" />
      </Form.Item>
    </SetModal>
  )
}

export default SetTickerModal
