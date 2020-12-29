import { selectorFamily } from "recoil"
import { isNil } from "ramda"
import { contentsState } from "./database"
import { prevDateQuery } from "./date"

export const tickersWithPriceQuery = selectorFamily({
  key: "tickersWithPrice",
  get: (date: string) => ({ get }) => {
    const { tickers, prices } = get(contentsState)
    const prevDate = get(prevDateQuery(date))
    const priceItemYesterday = prices[prevDate]
    const priceItem = prices[date]

    /* table */
    const dataSource = Object.values(tickers)
      .map((ticker) => {
        const { tickerKey } = ticker
        const price = priceItem[tickerKey]?.price
        const yesterday = priceItemYesterday[tickerKey]?.price
        const change = price ? price / yesterday - 1 : undefined
        return { ...ticker, price, change }
      })
      .sort(({ aim: a = 0 }, { aim: b = 0 }) => b - a)
      .sort(({ change: a = 0 }, { change: b = 0 }) => b - a)
      .sort(
        ({ change: a }, { change: b }) => Number(isNil(a)) - Number(isNil(b))
      )

    return dataSource
  },
})
