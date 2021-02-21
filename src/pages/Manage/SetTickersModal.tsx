import React from "react"
import { useRecoilValue } from "recoil"
import { Form, Slider } from "antd"
import { percent } from "../../utils/format"
import { contentsState, setTickers } from "../../database/database"
import SetModal from "./SetModal"

const MARKS = Array.from({ length: 20 }, (_, i) => (i + 1) / 20).reduce(
  (acc, cur) => ({ ...acc, [cur]: cur % 0.25 ? "" : percent(cur) }),
  {}
)

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

  return (
    <SetModal type="edit" form={{ form, initialValues }} submit={submit}>
      {Object.values(tickers)
        .filter(({ hidden }) => !hidden)
        .sort(({ aim: a = 0 }, { aim: b = 0 }) => b - a)
        .map(({ tickerKey, name, aim }) => (
          <Form.Item name={tickerKey} label={name} key={tickerKey}>
            <Slider min={0} max={1} step={0.05} marks={MARKS} />
          </Form.Item>
        ))}
    </SetModal>
  )
}

export default SetTickersModal
