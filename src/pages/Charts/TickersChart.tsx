import { ReactNode } from "react"
import { useRecoilValue } from "recoil"
import { Card } from "antd"
import { ChartDataSets } from "chart.js"
import { formatAmount, formatKRW, formatM, percent } from "../../utils/format"
import { contentsState } from "../../database/database"
import { chartHistoryQuery } from "../../database/history"
import ChartTitle from "../../components/ChartTitle"
import { dataset, colors } from "./chartUtils"
import Chart from "./Chart"

interface Props {
  validate: (date: string) => boolean
  extra: ReactNode
  asPercent: boolean
  type: "balance" | "value"
}

const TickersChart = ({ validate, extra, asPercent, type }: Props) => {
  const history = useRecoilValue(chartHistoryQuery)
  const filtered = history.filter(({ date }) => validate(date))

  const { tickers } = useRecoilValue(contentsState)
  const tickerKeys = Object.keys(tickers)

  const collectHistory = (tickerKey: string) =>
    filtered.map(({ date, ticker }) => {
      const { ticker: initialTicker } = filtered[0]
      const current = ticker[tickerKey][type]
      const initial = initialTicker[tickerKey][type]
      const value = current - initial
      const change = value / initial

      return { t: new Date(date), y: asPercent ? change : value }
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

  const formatPercent = (value: number) =>
    (value > 0 ? "+" : "") + percent(value)

  const format = { value: formatKRW, balance: formatAmount }
  const formatY = { value: formatM, balance: formatAmount }

  return (
    <>
      <ChartTitle title="가치" extra={extra} />

      <Card>
        <Chart
          datasets={datasets}
          format={asPercent ? formatPercent : format[type]}
          formatY={asPercent ? formatPercent : formatY[type]}
          unit="day"
          legend
          affixLabel
        />
      </Card>
    </>
  )
}

export default TickersChart
