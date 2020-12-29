import { useRecoilValue } from "recoil"
import { Card } from "antd"
import { percent } from "../../utils/format"
import { contentsState } from "../../database/database"
import ChartTitle from "../../components/ChartTitle"
import { dataset, colors } from "./chartUtils"
import Chart from "./Chart"

const PricesChart = ({ validate }: { validate: (date: string) => boolean }) => {
  const { tickers, prices, exchanges } = useRecoilValue(contentsState)
  const tickerKeys = Object.keys(tickers)

  const filteredPrices = Object.entries(prices).filter(([date]) =>
    validate(date)
  )

  const filteredExchanges = Object.entries(exchanges).filter(([date]) =>
    validate(date)
  )

  const exchangesDatasets = {
    ...dataset,
    borderColor: colors.aqua,
    borderWidth: 2,
    label: "USD",
    data: filteredExchanges.map(([date, { USD }]) => {
      const { USD: initialExchange } = filteredExchanges[0][1]
      return { t: new Date(date), y: (USD - initialExchange) / initialExchange }
    }),
  }

  const collectPrice = (tickerKey: string) =>
    filteredPrices.map(([date, priceItem]) => {
      const price = findPrice(tickerKey, priceItem)
      const initialPrice = findPrice(tickerKey, filteredPrices[0][1])
      return { t: new Date(date), y: (price - initialPrice) / initialPrice }
    })

  const datasets = tickerKeys
    .map((tickerKey) => {
      const { name, color } = tickers[tickerKey]

      return {
        ...dataset,
        borderColor: color ? colors[color] : "white",
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
        <Chart
          datasets={datasets}
          format={percent}
          unit="day"
          legend
          affixLabel
        />
      </Card>
    </>
  )
}

export default PricesChart

/* helpers */
const findPrice = (tickerKey: string, priceItem: PriceItem) =>
  Object.values(priceItem).find((item) => item.tickerKey === tickerKey)
    ?.price ?? 0
