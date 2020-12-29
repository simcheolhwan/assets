import { useState } from "react"
import { useRecoilValue } from "recoil"
import { Card, Radio, Space } from "antd"
import { ChartDataSets } from "chart.js"
import { formatKRW, formatM, percent } from "../../utils/format"
import { contentsState } from "../../database/database"
import { historyQuery } from "../../database/history"
import ChartTitle from "../../components/ChartTitle"
import { dataset, colors } from "./chartUtils"
import Chart from "./Chart"

const ValuesChart = ({ validate }: { validate: (date: string) => boolean }) => {
  const [key, setKey] = useState<"balance" | "value">("value")
  const history = useRecoilValue(historyQuery)
  const filtered = history.filter(({ date }) => validate(date))

  const { tickers } = useRecoilValue(contentsState)
  const tickerKeys = Object.keys(tickers)

  const collectHistory = (tickerKey: string) =>
    filtered.map(({ date, list }) => {
      const { list: initialList } = filtered[0]
      const current = find(tickerKey, list, key)
      const initial = find(tickerKey, initialList, key)

      const value = {
        balance: (current - initial) / initial,
        value: current - initial,
      }

      return { t: new Date(date), y: value[key] }
    })

  const datasets = tickerKeys
    .reduce<ChartDataSets[]>((acc, tickerKey) => {
      const { name, color } = tickers[tickerKey]

      return [
        ...acc,
        {
          ...dataset,
          borderColor: color ? colors[color] : "white",
          borderWidth: 2,
          label: name,
          data: collectHistory(tickerKey),
        },
      ]
    }, [])
    .filter(({ data }) => (data as ChartPoint[]).some(({ y }) => y))
    .sort(({ label: a = "" }, { label: b = "" }) => a.localeCompare(b))

  const format = {
    balance: (value: number) => (value > 0 ? "+" : "") + percent(value),
    value: formatKRW,
  }

  return (
    <>
      <ChartTitle
        title="가치"
        extra={
          <Space wrap>
            <Radio.Group
              value={key}
              onChange={(e) => setKey(e.target.value)}
              optionType="button"
              buttonStyle="solid"
            >
              <Radio.Button value="value">가치</Radio.Button>
              <Radio.Button value="balance">잔고</Radio.Button>
            </Radio.Group>
          </Space>
        }
      />

      <Card>
        <Chart
          datasets={datasets}
          format={format[key]}
          formatY={key === "value" ? formatM : undefined}
          unit="day"
          legend
          affixLabel
        />
      </Card>
    </>
  )
}

export default ValuesChart

/* helpers */
interface Item {
  tickerKey: string
  balance: number
  value: number
}

const find = (tickerKey: string, list: Item[], key: "balance" | "value") =>
  list.find((d) => d.tickerKey === tickerKey)?.[key] ?? 0
