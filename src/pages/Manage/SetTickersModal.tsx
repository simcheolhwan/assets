import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Slider } from "antd"
import { percent } from "../../utils/format"
import { contentsState, setTickers } from "../../database/database"
import SetModal from "./SetModal"

const SetTickersModal = () => {
  const [form] = Form.useForm<Dictionary<number>>()

  const { tickers } = useRecoilValue(contentsState)
  const initialValues = Object.values(tickers).reduce(
    (acc, { tickerKey, aim }) => ({ ...acc, [tickerKey]: aim }),
    {}
  )

  const submit = async () => {
    const values = await form.validateFields()
    const next = Object.values(tickers).reduce((acc, item) => {
      const { tickerKey } = item
      const aim = values[tickerKey] || null
      return { ...acc, [tickerKey]: { ...item, aim } }
    }, {})

    await setTickers(next)
    form.resetFields()
  }

  const format = (value?: number) => (value ? percent(value) : "")

  return (
    <SetModal type="edit" form={{ form, initialValues }} submit={submit}>
      {Object.values(tickers)
        .filter(({ hidden }) => !hidden)
        .sort(({ aim: a = 0 }, { aim: b = 0 }) => b - a)
        .map(({ tickerKey, name }) => (
          <Form.Item name={tickerKey} label={name} key={tickerKey}>
            <Slider min={0} max={1} step={0.01} tipFormatter={format} />
          </Form.Item>
        ))}
    </SetModal>
  )
}

export default SetTickersModal
