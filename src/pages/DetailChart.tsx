import { Card } from "antd"
import { useRecoilValue } from "recoil"
import { ChartDataSets } from "chart.js"
import { contentsState } from "../database/database"
import { historyQuery } from "../database/chart"
import { colors, dataset } from "./chartUtils"
import Chart from "./Chart"

const tickerColors: Dictionary<string> = {
  "mQQQ-UST LP": colors.blue,
  "MIR-UST LP": colors.aqua,
  TQQQ: colors.red,
  LUNA: colors.orange,
  KRW: colors.purple,
}

const DetailChart = () => {
  const history = useRecoilValue(historyQuery)
  const { tickers } = useRecoilValue(contentsState)
  const tickerKeys = Object.keys(tickers)

  const collectHistory = (tickerKey: string) =>
    history.map(({ date, dataSource }) => ({
      t: new Date(date),
      y: dataSource.reduce(
        (acc, { value, tickerKey: key }) =>
          key === tickerKey ? acc + value : acc,
        0
      ),
    }))

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
    .filter(({ data }) => (data as ChartPoint[]).every(({ y }) => y))

  return (
    <>
      <h1 style={{ marginTop: 16 }}>종목</h1>

      <Card>
        <Chart datasets={datasets} legend />
      </Card>
    </>
  )
}

export default DetailChart
