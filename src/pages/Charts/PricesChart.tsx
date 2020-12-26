import { Card } from "antd"
import { useRecoilValue } from "recoil"
import { percent } from "../../utils/format"
import { contentsState } from "../../database/database"
import ChartTitle from "../../components/ChartTitle"
import { dataset, tickerColors } from "./chartUtils"
import Chart from "./Chart"

const PricesChart = () => {
  const { tickers, prices, exchanges } = useRecoilValue(contentsState)
  const tickerKeys = Object.keys(tickers)

  const exchangesDatasets = {
    ...dataset,
    borderColor: tickerColors["USD"],
    borderWidth: 2,
    label: "USD",
    data: Object.entries(exchanges).map(([date, { USD }]) => {
      const { USD: initialExchange } = Object.values(exchanges)[0]
      return { t: new Date(date), y: (USD - initialExchange) / initialExchange }
    }),
  }

  const collectPrice = (tickerKey: string) =>
    Object.entries(prices).map(([date, priceItem]) => {
      const price = findPrice(tickerKey, priceItem)
      const initialPrice = findPrice(tickerKey, Object.values(prices)[0])
      return { t: new Date(date), y: (price - initialPrice) / initialPrice }
    })

  const datasets = tickerKeys
    .map((tickerKey) => {
      const { name } = tickers[tickerKey]

      return {
        ...dataset,
        borderColor: tickerColors[name],
        borderWidth: 2,
        label: name,
        data: collectPrice(tickerKey),
      }
    })
    .filter(({ data }) => (data as ChartPoint[]).some(({ y }) => y))
    .sort(({ label: a = "" }, { label: b = "" }) => a.localeCompare(b))
    .concat(exchangesDatasets)

  return (
    <>
      <ChartTitle title="가격" style={{ marginTop: "1em" }} />

      <Card>
        <Chart datasets={datasets} format={percent} unit="day" legend />
      </Card>
    </>
  )
}

export default PricesChart

/* helpers */
const findPrice = (tickerKey: string, priceItem: PriceItem) =>
  Object.values(priceItem).find((item) => item.tickerKey === tickerKey)
    ?.price ?? 0
