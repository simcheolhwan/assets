import { selector } from "recoil"
import { isNil } from "ramda"
import { contentsState } from "./database"
import { todayQuery, yesterdayQuery } from "./date"

export const tickersWithPriceQuery = selector({
  key: "tickersWithPrice",
  get: ({ get }) => {
    const today = get(todayQuery)
    const yesterday = get(yesterdayQuery)
    const { tickers, prices } = get(contentsState)

    const priceItem = prices[today]
    const priceItemYesterday = prices[yesterday]

    return Object.values(tickers)
      .map((ticker) => {
        const { tickerKey } = ticker
        const price = priceItem[tickerKey]?.price
        const yesterdayPrice = priceItemYesterday[tickerKey]?.price
        const change = price ? price / yesterdayPrice - 1 : undefined

        return { ...ticker, price, change }
      })
      .sort(({ aim: a = 0 }, { aim: b = 0 }) => b - a)
      .sort(({ change: a = 0 }, { change: b = 0 }) => b - a)
      .sort(
        ({ change: a }, { change: b }) => Number(isNil(a)) - Number(isNil(b))
      )
  },
})
