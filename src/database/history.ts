import { selector, selectorFamily, waitForAll } from "recoil"
import { daysQuery } from "./date"
import { dayStatsQuery } from "./day"
import { tickerRatiosQuery } from "./tickers"

export const chartItemQuery = selectorFamily({
  key: "chartItem",
  get: (date: string) => ({ get }) => {
    const stats = get(dayStatsQuery(date))
    const ticker = get(tickerRatiosQuery(date))
    return { date, stats, ticker }
  },
})

export const chartHistoryQuery = selector({
  key: "chartHistoryHistory",
  get: ({ get }) => {
    const days = get(daysQuery)
    return get(waitForAll(days.map(chartItemQuery)))
  },
})
