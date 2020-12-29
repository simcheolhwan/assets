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

const ValuesChart = () => {
  const [key, setKey] = useState<"balance" | "value">("value")
  const history = useRecoilValue(historyQuery)
  const { tickers } = useRecoilValue(contentsState)
  const tickerKeys = Object.keys(tickers)

  const collectHistory = (tickerKey: string) =>
    history.map(({ date, dataSource }) => {
      const { dataSource: initialDataSource } = history[0]
      const current = find(tickerKey, dataSource, key)
      const initial = find(tickerKey, initialDataSource, key)

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
const find = (
  tickerKey: string,
  dataSource: { tickerKey: string; balance: number; value: number }[],
  key: "balance" | "value"
) => dataSource.find((d) => d.tickerKey === tickerKey)?.[key] ?? 0
