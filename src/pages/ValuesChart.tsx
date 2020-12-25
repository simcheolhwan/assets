import { Card } from "antd"
import { useRecoilValue } from "recoil"
import { ChartDataSets } from "chart.js"
import { contentsState } from "../database/database"
import { historyQuery } from "../database/chart"
import { dataset, tickerColors } from "./chartUtils"
import Chart from "./Chart"

const ValuesChart = () => {
  const history = useRecoilValue(historyQuery)
  const { tickers } = useRecoilValue(contentsState)
  const tickerKeys = Object.keys(tickers)

  const collectHistory = (tickerKey: string) =>
    history.map(({ date, dataSource }) => {
      const { dataSource: initialDataSource } = history[0]
      const value1 = findValue(tickerKey, dataSource)
      const value2 = findValue(tickerKey, initialDataSource)
      return { t: new Date(date), y: value1 - value2 }
    })

  const datasets = tickerKeys
    .reduce<ChartDataSets[]>((acc, tickerKey) => {
      const { name } = tickers[tickerKey]

      return [
        ...acc,
        {
          ...dataset,
          borderColor: tickerColors[name],
          borderWidth: 2,
          label: name,
          data: collectHistory(tickerKey),
        },
      ]
    }, [])
    .filter(({ data }) => (data as ChartPoint[]).some(({ y }) => y))

  return (
    <>
      <h1 style={{ marginTop: 16 }}>가치</h1>

      <Card>
        <Chart datasets={datasets} unit="day" legend />
      </Card>
    </>
  )
}

export default ValuesChart

/* helpers */
const findValue = (
  tickerKey: string,
  dataSource: { tickerKey: string; value: number }[]
) => dataSource.find((d) => d.tickerKey === tickerKey)?.value ?? 0
